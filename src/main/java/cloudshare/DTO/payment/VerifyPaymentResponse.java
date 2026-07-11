package cloudshare.DTO.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VerifyPaymentResponse {
    private boolean verified;
    private String orderId;
    private String paymentId;
    private Integer creditsAdded;
    private Integer remainingCredits;
    private String status;
}