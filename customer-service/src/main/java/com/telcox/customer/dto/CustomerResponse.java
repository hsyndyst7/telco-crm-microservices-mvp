package com.telcox.customer.dto;

import com.telcox.customer.model.CustomerStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class CustomerResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String identityNumber;
    private String email;
    private String phoneNumber;
    private CustomerStatus status;
    private LocalDateTime createdAt;
}