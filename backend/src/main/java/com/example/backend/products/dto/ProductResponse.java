package com.example.backend.products.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class ProductResponse {

    private Long id;
    private String productCode;
    private Long categoryId;
    private String categoryName;
    private String name;
    private String slug;
    private String description;
    private String gender;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean bestSeller;
    private BigDecimal price;
    private List<String> images;
    private List<com.example.backend.variants.dto.ProductVariantResponse> variants;
    private List<com.example.backend.productimages.dto.ProductImageResponse> imageDetails;
}
