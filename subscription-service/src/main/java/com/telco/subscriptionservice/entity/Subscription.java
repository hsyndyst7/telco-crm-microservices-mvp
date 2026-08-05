package com.telco.subscriptionservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long customerId;

    @Column(nullable = false)
    private Long planId; // Örn: Fiber Internet, Postpaid Mobile Plan ID

    @Column(nullable = false)
    private String status; // ACTIVE, CANCELLED, SUSPENDED

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    @PrePersist
    public void onCreate() {
        this.startDate = LocalDateTime.now();
        if (this.status == null) {
            this.status = "ACTIVE";
        }
    }
}
