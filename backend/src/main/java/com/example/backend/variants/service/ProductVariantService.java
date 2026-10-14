package com.example.backend.variants.service;

import com.example.backend.variants.dto.ProductVariantRequest;
import com.example.backend.variants.dto.ProductVariantResponse;

import java.util.List;

import com.example.backend.common.dto.PageResponse;

public interface ProductVariantService {

    PageResponse<ProductVariantResponse> getAllVariants(String name, int page, int size);

    ProductVariantResponse getVariantById(Long id);

    ProductVariantResponse createVariant(ProductVariantRequest request);

    ProductVariantResponse updateVariant(Long id, ProductVariantRequest request);

    void deleteVariant(Long id);
}
