package com.example.productcatalogservice.service;

import com.example.productcatalogservice.dto.ProductCreateRequest;
import com.example.productcatalogservice.dto.ProductResponse;

import java.util.List;

public interface ProductService {
    ProductResponse createProduct(ProductCreateRequest request);
    List<ProductResponse> getAllProducts();
    ProductResponse getProductById(Long id);
}
