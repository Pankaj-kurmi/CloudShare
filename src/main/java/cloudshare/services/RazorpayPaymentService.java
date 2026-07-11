package cloudshare.services;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.HexFormat;
import java.util.Locale;
import java.util.UUID;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

import cloudshare.DTO.payment.CreateOrderRequest;
import cloudshare.DTO.payment.CreateOrderResponse;
import cloudshare.DTO.payment.VerifyPaymentRequest;
import cloudshare.DTO.payment.VerifyPaymentResponse;
import cloudshare.document.PaymentTransactionDocument;
import cloudshare.document.ProfileDocument;
import cloudshare.repositry.PaymentTransactionRepository;

@Service
public class RazorpayPaymentService {

    private final PaymentTransactionRepository paymentTransactionRepository;
    private final ProfileService profileService;
    private final UserCreditsService userCreditsService;

    private final String razorpayKeyId;
    private final String razorpayKeySecret;
    private final String razorpayCurrency;
    private final int creditPricePaise;
    private final RazorpayClient razorpayClient;

    public RazorpayPaymentService(
            PaymentTransactionRepository paymentTransactionRepository,
            ProfileService profileService,
            UserCreditsService userCreditsService,
            @Value("${cloudshare.razorpay.key-id:}") String razorpayKeyId,
            @Value("${cloudshare.razorpay.key-secret:}") String razorpayKeySecret,
            @Value("${cloudshare.razorpay.currency:INR}") String razorpayCurrency,
            @Value("${cloudshare.razorpay.credit-price-paise:10000}") int creditPricePaise) {
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.profileService = profileService;
        this.userCreditsService = userCreditsService;
        this.razorpayKeyId = razorpayKeyId;
        this.razorpayKeySecret = razorpayKeySecret;
        this.razorpayCurrency = razorpayCurrency;
        this.creditPricePaise = creditPricePaise;

        if (StringUtils.hasText(razorpayKeyId) && StringUtils.hasText(razorpayKeySecret)) {
            try {
                this.razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            } catch (RazorpayException ex) {
                throw new IllegalStateException("Unable to initialize Razorpay client", ex);
            }
        } else {
            this.razorpayClient = null;
        }
    }

    public CreateOrderResponse createOrder(CreateOrderRequest request) {
        ensureConfigured();

        if (request == null || request.getCredits() == null || request.getCredits() <= 0) {
            throw new IllegalArgumentException("Credits must be greater than zero");
        }

        ProfileDocument currentProfile = profileService.getCurrentProfile();
        int amountPaise = request.getCredits() * creditPricePaise;
        String receipt = "cloudshare-" + currentProfile.getClerkId() + "-" + UUID.randomUUID();

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountPaise);
        orderRequest.put("currency", razorpayCurrency);
        orderRequest.put("receipt", receipt);
        orderRequest.put("payment_capture", 1);

        try {
            Order order = razorpayClient.orders.create(orderRequest);
            String orderId = String.valueOf(order.get("id"));

            paymentTransactionRepository.save(PaymentTransactionDocument.builder()
                    .clerkId(currentProfile.getClerkId())
                    .razorpayOrderId(orderId)
                    .creditsPurchased(request.getCredits())
                    .amountPaise(amountPaise)
                    .currency(razorpayCurrency)
                    .status("CREATED")
                    .receipt(receipt)
                    .createdAt(Instant.now())
                    .build());

            return CreateOrderResponse.builder()
                    .orderId(orderId)
                    .receipt(receipt)
                    .amountPaise(amountPaise)
                    .currency(razorpayCurrency)
                    .credits(request.getCredits())
                    .keyId(razorpayKeyId)
                    .status("CREATED")
                    .build();
        } catch (RazorpayException ex) {
            throw new IllegalStateException("Unable to create Razorpay order", ex);
        }
    }

    public VerifyPaymentResponse verifyPayment(VerifyPaymentRequest request) {
        ensureConfigured();

        if (request == null
                || !StringUtils.hasText(request.getRazorpayOrderId())
                || !StringUtils.hasText(request.getRazorpayPaymentId())
                || !StringUtils.hasText(request.getRazorpaySignature())) {
            throw new IllegalArgumentException("Order id, payment id and signature are required");
        }

        ProfileDocument currentProfile = profileService.getCurrentProfile();
        PaymentTransactionDocument transaction = paymentTransactionRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new IllegalArgumentException("Payment order not found"));

        if (!currentProfile.getClerkId().equals(transaction.getClerkId())) {
            throw new IllegalArgumentException("Payment order does not belong to the current user");
        }

        if (StringUtils.hasText(transaction.getRazorpayPaymentId())) {
            return buildResponse(transaction, userCreditsService.getUserCredits(currentProfile.getClerkId()).getCredits());
        }

        if (!isSignatureValid(request.getRazorpayOrderId(), request.getRazorpayPaymentId(), request.getRazorpaySignature())) {
            throw new IllegalArgumentException("Invalid Razorpay signature");
        }

        transaction.setRazorpayPaymentId(request.getRazorpayPaymentId());
        transaction.setRazorpaySignature(request.getRazorpaySignature());
        transaction.setStatus("VERIFIED");
        transaction.setVerifiedAt(Instant.now());
        paymentTransactionRepository.save(transaction);

        int remainingCredits = userCreditsService.addCredits(currentProfile.getClerkId(), transaction.getCreditsPurchased()).getCredits();
        return buildResponse(transaction, remainingCredits);
    }

    public Integer getCurrentCreditBalance() {
        return userCreditsService.getUserCredits().getCredits();
    }

    private VerifyPaymentResponse buildResponse(PaymentTransactionDocument transaction, int remainingCredits) {
        return VerifyPaymentResponse.builder()
                .verified(true)
                .orderId(transaction.getRazorpayOrderId())
                .paymentId(transaction.getRazorpayPaymentId())
                .creditsAdded(transaction.getCreditsPurchased())
                .remainingCredits(remainingCredits)
                .status(transaction.getStatus())
                .build();
    }

    private boolean isSignatureValid(String orderId, String paymentId, String signature) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(razorpayKeySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal((orderId + "|" + paymentId).getBytes(StandardCharsets.UTF_8));
            String generatedSignature = HexFormat.of().formatHex(hash);
            return MessageDigest.isEqual(
                    generatedSignature.toLowerCase(Locale.ROOT).getBytes(StandardCharsets.UTF_8),
                    signature.toLowerCase(Locale.ROOT).getBytes(StandardCharsets.UTF_8));
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to verify Razorpay signature", ex);
        }
    }

    private void ensureConfigured() {
        if (razorpayClient == null) {
            throw new IllegalStateException("Razorpay credentials are not configured");
        }
    }
}