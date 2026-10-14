package com.example.backend.variants.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class ProductVariantResponse {

    private Long id;
    private Long productId;
    private String productName;
    private Long colorId;
    private String colorName;
    private Long sizeId;
    private String sizeName;
    private String sku;
    private BigDecimal price;
    private Integer quantity;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
