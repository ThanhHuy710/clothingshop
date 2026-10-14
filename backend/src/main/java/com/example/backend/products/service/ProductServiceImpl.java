package com.example.backend.products.service;

import com.example.backend.categories.entity.Category;
import com.example.backend.categories.repository.CategoryRepository;
import com.example.backend.common.dto.PageResponse;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.products.dto.ProductRequest;
import com.example.backend.products.dto.ProductResponse;
import com.example.backend.products.entity.Product;
import com.example.backend.products.mapper.ProductMapper;
import com.example.backend.products.repository.ProductRepository;
import com.example.backend.products.repository.ProductSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> getProducts(
            String name, Long categoryId, String gender, Long colorId, Long sizeId, java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice, Boolean bestSeller, String sort, int page, int size) {
        
        Sort sortOrder = Sort.by(Sort.Direction.DESC, "createdAt");
        if ("OLDEST".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by(Sort.Direction.ASC, "createdAt");
        } else if ("PRICE_ASC".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by(Sort.Direction.ASC, "basePrice");
        } else if ("PRICE_DESC".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by(Sort.Direction.DESC, "basePrice");
        }

        Pageable pageable = PageRequest.of(page, size, sortOrder);

        org.springframework.data.jpa.domain.Specification<Product> spec = org.springframework.data.jpa.domain.Specification.where(
                ProductSpecification.isNotDeleted())
                .and(ProductSpecification.hasName(name))
                .and(ProductSpecification.hasCategoryId(categoryId))
                .and(ProductSpecification.hasGender(gender))
                .and(ProductSpecification.hasColorId(colorId))
                .and(ProductSpecification.isBestSeller(bestSeller))
                .and(ProductSpecification.hasSizeId(sizeId))
                .and(ProductSpecification.hasPriceBetween(minPrice, maxPrice));

        Page<Product> productPage = productRepository.findAll(spec, pageable);
        
        Page<ProductResponse> responsePage = productPage.map(productMapper::toResponse);
        return PageResponse.of(responsePage);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = getActiveProductById(id);
        return productMapper.toResponse(product);
    }

    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        if (productRepository.existsBySlugAndDeletedAtIsNull(request.getSlug())) {
            throw new BadRequestException("Product slug already exists");
        }

        Category category = getCategoryById(request.getCategoryId());

        Product product = productMapper.toEntity(request);
        product.setCategory(category);
        if (request.getStatus() == null) {
            product.setStatus("ACTIVE");
        }
        if (request.getBestSeller() == null) {
            product.setBestSeller(false);
        }

        Product savedProduct = productRepository.save(product);
        savedProduct.setProductCode(String.format("SP-%06d", savedProduct.getId()));
        savedProduct = productRepository.save(savedProduct);
        return productMapper.toResponse(savedProduct);
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = getActiveProductById(id);

        if (productRepository.existsBySlugAndIdNotAndDeletedAtIsNull(request.getSlug(), id)) {
            throw new BadRequestException("Product slug already exists");
        }

        Category category = getCategoryById(request.getCategoryId());

        productMapper.updateEntityFromRequest(request, product);
        product.setCategory(category);
        if (request.getBestSeller() == null) {
            product.setBestSeller(false);
        }

        Product updatedProduct = productRepository.save(product);
        return productMapper.toResponse(updatedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = getActiveProductById(id);
        product.setDeletedAt(LocalDateTime.now());
        productRepository.save(product);
    }

    private Product getActiveProductById(Long id) {
        return productRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    private Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }
}
