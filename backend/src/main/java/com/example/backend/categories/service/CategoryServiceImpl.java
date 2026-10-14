package com.example.backend.categories.service;

import com.example.backend.categories.dto.CategoryRequest;
import com.example.backend.categories.dto.CategoryResponse;
import com.example.backend.categories.entity.Category;
import com.example.backend.categories.mapper.CategoryMapper;
import com.example.backend.categories.repository.CategoryRepository;
import com.example.backend.cloudinary.CloudinaryService;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final CloudinaryService cloudinaryService;

    @Override
    @Transactional(readOnly = true)
    public com.example.backend.common.dto.PageResponse<CategoryResponse> getAllCategories(String name, int page, int size) {
        String keyword = (name != null && !name.trim().isEmpty()) ? name.trim() : null;
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        org.springframework.data.domain.Page<Category> categoryPage = categoryRepository.findAllWithSearch(keyword, pageable);
        org.springframework.data.domain.Page<CategoryResponse> responsePage = categoryPage.map(categoryMapper::toResponse);
        return com.example.backend.common.dto.PageResponse.of(responsePage);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        Category category = getActiveCategoryById(id);
        return categoryMapper.toResponse(category);
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsBySlug(request.getSlug())) {
            throw new BadRequestException("Category slug already exists");
        }
        Category category = categoryMapper.toEntity(request);
        Category savedCategory = categoryRepository.save(category);
        savedCategory.setCategoryCode(String.format("DM-%06d", savedCategory.getId()));
        savedCategory = categoryRepository.save(savedCategory);
        return categoryMapper.toResponse(savedCategory);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = getActiveCategoryById(id);

        if (categoryRepository.existsBySlugAndIdNot(request.getSlug(), id)) {
            throw new BadRequestException("Category slug already exists");
        }

        categoryMapper.updateEntityFromRequest(request, category);
        Category updatedCategory = categoryRepository.save(category);
        return categoryMapper.toResponse(updatedCategory);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        Category category = getActiveCategoryById(id);
        
        if (category.getImagePublicId() != null) {
            cloudinaryService.deleteImage(category.getImagePublicId());
        }
        
        categoryRepository.delete(category);
    }

    @Override
    @Transactional
    public CategoryResponse uploadImage(Long id, MultipartFile file) {
        Category category = getActiveCategoryById(id);

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BadRequestException("Invalid file type. Only images are allowed");
        }

        String folder = "haiphongshop/danhmuc";
        String oldPublicId = category.getImagePublicId();

        try {
            Map<String, Object> result = cloudinaryService.uploadImage(file, folder);
            String secureUrl = (String) result.get("secure_url");
            String newPublicId = (String) result.get("public_id");
            
            category.setImageUrl(secureUrl);
            category.setImagePublicId(newPublicId);
            
            category = categoryRepository.save(category);

            if (oldPublicId != null) {
                cloudinaryService.deleteImage(oldPublicId);
            }
            
            return categoryMapper.toResponse(category);
        } catch (Exception e) {
            throw new BadRequestException("Failed to upload image to Cloudinary: " + e.getMessage());
        }
    }

    private Category getActiveCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }
}
