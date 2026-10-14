package com.example.backend.products.service;

import com.example.backend.products.dto.ProductRequest;
import com.example.backend.products.dto.ProductResponse;

import java.util.List;

import com.example.backend.common.dto.PageResponse;

public interface ProductService {

    PageResponse<ProductResponse> getProducts(String name, Long categoryId, String gender, Long colorId, Long sizeId, java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice, Boolean bestSeller, String sort, int page, int size);

    ProductResponse getProductById(Long id);

    ProductResponse createProduct(ProductRequest request);

    ProductResponse updateProduct(Long id, ProductRequest request);

    void deleteProduct(Long id);
}
