package com.telcox.customer.service;

import com.telcox.customer.dto.CustomerCreateRequest;
import com.telcox.customer.dto.CustomerResponse;
import com.telcox.customer.model.Customer;
import com.telcox.customer.model.CustomerStatus;
import com.telcox.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public List<CustomerResponse> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public CustomerResponse createCustomer(CustomerCreateRequest request) {
        if (customerRepository.existsByIdentityNumber(request.getIdentityNumber())) {
            throw new RuntimeException("Bu TCKN ile kayıtlı müşteri zaten var!");
        }

        Customer customer = Customer.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .identityNumber(request.getIdentityNumber())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .status(CustomerStatus.PENDING)
                .build();

        Customer saved = customerRepository.save(customer);
        return mapToResponse(saved);
    }

    public CustomerResponse approveKyc(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Müşteri bulunamadı!"));

        customer.setStatus(CustomerStatus.ACTIVE);
        Customer updated = customerRepository.save(customer);
        return mapToResponse(updated);
    }

    public CustomerResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Müşteri bulunamadı!"));
        return mapToResponse(customer);
    }

    private CustomerResponse mapToResponse(Customer customer) {
        return CustomerResponse.builder()
                .id(customer.getId())
                .firstName(customer.getFirstName())
                .lastName(customer.getLastName())
                .identityNumber(customer.getIdentityNumber())
                .email(customer.getEmail())
                .phoneNumber(customer.getPhoneNumber())
                .status(customer.getStatus())
                .createdAt(customer.getCreatedAt())
                .build();
    }
}
