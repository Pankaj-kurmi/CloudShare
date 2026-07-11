package cloudshare.document;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "payment-transactions")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentTransactionDocument {

    @Id
    private String id;

    private String clerkId;

    @Indexed(unique = true)
    private String razorpayOrderId;

    @Indexed(unique = true, sparse = true)
    private String razorpayPaymentId;

    private String razorpaySignature;

    private Integer creditsPurchased;

    private Integer amountPaise;

    private String currency;

    private String status;

    private String receipt;

    private Instant createdAt;

    private Instant verifiedAt;
}