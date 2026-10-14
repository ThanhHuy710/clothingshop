package com.example.backend.productimages.service;

import com.example.backend.cloudinary.CloudinaryService;
import com.example.backend.colors.entity.Color;
import com.example.backend.colors.repository.ColorRepository;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.productimages.dto.ProductImageResponse;
import com.example.backend.productimages.entity.ProductImage;
import com.example.backend.productimages.mapper.ProductImageMapper;
import com.example.backend.productimages.repository.ProductImageRepository;
import com.example.backend.products.entity.Product;
import com.example.backend.products.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductImageServiceImpl implements ProductImageService {

    private final ProductImageRepository productImageRepository;
    private final ProductRepository productRepository;
    private final ColorRepository colorRepository;
    private final CloudinaryService cloudinaryService;
    private final ProductImageMapper productImageMapper;

    @Override
    @Transactional
    public ProductImageResponse uploadImage(Long productId, Long colorId, Boolean isPrimary, Integer sortOrder, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is missing or empty");
        }
        
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BadRequestException("Only image files are allowed");
        }

        Product product = productRepository.findByIdAndDeletedAtIsNull(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Color color = null;
        if (colorId != null) {
            color = colorRepository.findById(colorId)
                    .orElseThrow(() -> new ResourceNotFoundException("Color not found"));
        }

        boolean primary = isPrimary != null && isPrimary;
        
        if (primary) {
            if (color != null) {
                if (productImageRepository.existsByProductIdAndColorIdAndIsPrimaryTrue(productId, colorId)) {
                    throw new BadRequestException("Primary image already exists for this product and color");
                }
            } else {
                if (productImageRepository.existsByProductIdAndIsPrimaryTrue(productId)) {
                    throw new BadRequestException("Primary image already exists for this product");
                }
            }
        }

        String folder = "haiphongshop/products";
        
        Map<String, Object> uploadResult;
        try {
            uploadResult = cloudinaryService.uploadImage(file, folder);
        } catch (Exception e) {
            throw new BadRequestException("Failed to upload image: " + e.getMessage());
        }

        String secureUrl = (String) uploadResult.get("secure_url");
        String publicId = (String) uploadResult.get("public_id");

        ProductImage productImage = new ProductImage();
        productImage.setProduct(product);
        productImage.setColor(color);
        productImage.setImageUrl(secureUrl);
        productImage.setPublicId(publicId);
        productImage.setPrimary(primary);
        productImage.setSortOrder(sortOrder != null ? sortOrder : 0);

        ProductImage savedImage;
        try {
            savedImage = productImageRepository.save(productImage);
        } catch (Exception e) {
            cloudinaryService.deleteImage(publicId);
            throw e;
        }

        return productImageMapper.toResponse(savedImage);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductImageResponse> getProductImages(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found");
        }
        List<ProductImage> images = productImageRepository.findByProductId(productId);
        return productImageMapper.toResponseList(images);
    }

    @Override
    @Transactional
    public void deleteImage(Long id) {
        ProductImage image = productImageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProductImage not found"));
        
        cloudinaryService.deleteImage(image.getPublicId());
        productImageRepository.delete(image);
    }

    @Override
    @Transactional
    public void setPrimaryImage(Long productId, Long imageId) {
        List<ProductImage> images = productImageRepository.findByProductId(productId);
        ProductImage target = images.stream().filter(img -> img.getId().equals(imageId)).findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("ProductImage not found"));
        
        Long colorId = target.getColor() != null ? target.getColor().getId() : null;
        
        for (ProductImage img : images) {
            Long imgColorId = img.getColor() != null ? img.getColor().getId() : null;
            if (java.util.Objects.equals(colorId, imgColorId)) {
                img.setPrimary(img.getId().equals(imageId));
            }
        }
        productImageRepository.saveAll(images);
    }
}
