package com.telcox.customer.repository;

import com.telcox.customer.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    boolean existsByIdentityNumber(String identityNumber);
    Optional<Customer> findByIdentityNumber(String identityNumber);
}   
