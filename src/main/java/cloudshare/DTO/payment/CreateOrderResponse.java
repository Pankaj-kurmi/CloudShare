package cloudshare.DTO.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateOrderResponse {
    private String orderId;
    private String receipt;
    private Integer amountPaise;
    private String currency;
    private Integer credits;
    private String keyId;
    private String status;
}