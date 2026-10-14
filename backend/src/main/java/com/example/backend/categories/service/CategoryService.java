package com.example.backend.categories.service;

import com.example.backend.categories.dto.CategoryRequest;
import com.example.backend.categories.dto.CategoryResponse;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.common.dto.PageResponse;

public interface CategoryService {
    PageResponse<CategoryResponse> getAllCategories(String name, int page, int size);
    CategoryResponse getCategoryById(Long id);
    CategoryResponse createCategory(CategoryRequest request);
    CategoryResponse updateCategory(Long id, CategoryRequest request);
    void deleteCategory(Long id);
    CategoryResponse uploadImage(Long id, MultipartFile file);
}
