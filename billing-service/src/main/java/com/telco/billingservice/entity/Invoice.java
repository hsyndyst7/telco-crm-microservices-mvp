package com.telco.billingservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long customerId;

    private Long orderId;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String status; // PAID, UNPAID, CANCELLED

    private LocalDateTime issueDate;
    private LocalDateTime dueDate;

    @PrePersist
    public void onCreate() {
        this.issueDate = LocalDateTime.now();
        this.dueDate = LocalDateTime.now().plusDays(30); // 30 gün sonrasına son ödeme
        if (this.status == null) {
            this.status = "UNPAID";
        }
    }
}
