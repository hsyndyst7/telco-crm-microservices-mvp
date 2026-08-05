package com.telco.billingservice.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class OrderKafkaListener {

    @KafkaListener(topics = "order-events", groupId = "billing-group")
    public void consumeOrderEvent(String message) {
        // Order-service tarafından fırlatılan sipariş olaylarını burada yakalayabiliriz
        System.out.println("Billing Service Kafka'dan mesajı aldı: " + message);
        // İsteğe bağlı olarak burada mesajı parse edip otomatik Invoice nesnesi kaydedebilirsin.
    }
}