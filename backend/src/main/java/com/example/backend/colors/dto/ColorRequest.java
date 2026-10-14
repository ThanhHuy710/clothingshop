package com.example.backend.colors.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ColorRequest {

    @NotBlank(message = "Color name is required")
    @Size(max = 50, message = "Color name cannot exceed 50 characters")
    private String name;

    @Size(max = 20, message = "Color code cannot exceed 20 characters")
    private String code;
}
