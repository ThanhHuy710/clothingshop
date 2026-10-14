package com.example.backend.products.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductRequest {

    @NotBlank(message = "Product name is required")
    @Size(max = 200, message = "Product name cannot exceed 200 characters")
    private String name;

    @NotBlank(message = "Slug is required")
    @Size(max = 250, message = "Slug cannot exceed 250 characters")
    private String slug;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    private String description;

    @Size(max = 20, message = "Gender cannot exceed 20 characters")
    private String gender;

    @Size(max = 20, message = "Status cannot exceed 20 characters")
    private String status;

    private Boolean bestSeller;
}
