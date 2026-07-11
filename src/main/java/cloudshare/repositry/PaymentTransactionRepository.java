package cloudshare.repositry;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import cloudshare.document.PaymentTransactionDocument;

public interface PaymentTransactionRepository extends MongoRepository<PaymentTransactionDocument, String> {
    Optional<PaymentTransactionDocument> findByRazorpayOrderId(String razorpayOrderId);

    Optional<PaymentTransactionDocument> findByRazorpayPaymentId(String razorpayPaymentId);
}