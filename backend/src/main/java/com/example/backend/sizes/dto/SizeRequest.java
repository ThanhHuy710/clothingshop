package com.example.backend.sizes.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SizeRequest {

    @NotBlank(message = "Size name is required")
    @Size(max = 20, message = "Size name cannot exceed 20 characters")
    private String name;

    @NotNull(message = "Sort order is required")
    @Min(value = 0, message = "Sort order must be greater than or equal to 0")
    private Integer sortOrder;
}
