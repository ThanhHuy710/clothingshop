package com.example.backend.productimages.service;

import com.example.backend.productimages.dto.ProductImageResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductImageService {

    ProductImageResponse uploadImage(Long productId, Long colorId, Boolean isPrimary, Integer sortOrder, MultipartFile file);

    List<ProductImageResponse> getProductImages(Long productId);

    void deleteImage(Long id);

    void setPrimaryImage(Long productId, Long imageId);
}
