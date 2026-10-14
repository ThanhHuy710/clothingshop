package com.example.backend.productimages.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductImageResponse {
    private Long id;
    private Long productId;
    private Long colorId;
    private String imageUrl;
    private String publicId;
    @com.fasterxml.jackson.annotation.JsonProperty("isPrimary")
    private boolean isPrimary;
    private Integer sortOrder;
}
