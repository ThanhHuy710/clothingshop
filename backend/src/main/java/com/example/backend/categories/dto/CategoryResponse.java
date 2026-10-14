package com.example.backend.categories.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryResponse {
    private Long id;
    private String categoryCode;
    private String name;
    private String slug;
    private String description;
    private String imageUrl;
}
