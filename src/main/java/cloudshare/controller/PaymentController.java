package cloudshare.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cloudshare.DTO.payment.CreateOrderRequest;
import cloudshare.DTO.payment.CreateOrderResponse;
import cloudshare.DTO.payment.VerifyPaymentRequest;
import cloudshare.DTO.payment.VerifyPaymentResponse;
import cloudshare.services.RazorpayPaymentService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/payments")
public class PaymentController {

    private final RazorpayPaymentService razorpayPaymentService;

    @PostMapping("/orders")
    public ResponseEntity<CreateOrderResponse> createOrder(@RequestBody CreateOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(razorpayPaymentService.createOrder(request));
    }

    @PostMapping("/verify")
    public ResponseEntity<VerifyPaymentResponse> verifyPayment(@RequestBody VerifyPaymentRequest request) {
        return ResponseEntity.ok(razorpayPaymentService.verifyPayment(request));
    }

    @GetMapping("/credits")
    public ResponseEntity<Integer> getCredits() {
        return ResponseEntity.ok(razorpayPaymentService.getCurrentCreditBalance());
    }
}