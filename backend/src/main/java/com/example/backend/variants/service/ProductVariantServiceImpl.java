package com.example.backend.variants.service;

import com.example.backend.colors.entity.Color;
import com.example.backend.colors.repository.ColorRepository;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.products.entity.Product;
import com.example.backend.products.repository.ProductRepository;
import com.example.backend.sizes.entity.Size;
import com.example.backend.sizes.repository.SizeRepository;
import com.example.backend.variants.dto.ProductVariantRequest;
import com.example.backend.variants.dto.ProductVariantResponse;
import com.example.backend.variants.entity.ProductVariant;
import com.example.backend.variants.mapper.ProductVariantMapper;
import com.example.backend.variants.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductVariantServiceImpl implements ProductVariantService {

    private final ProductVariantRepository variantRepository;
    private final ProductRepository productRepository;
    private final ColorRepository colorRepository;
    private final SizeRepository sizeRepository;
    private final ProductVariantMapper variantMapper;

    @Override
    @Transactional(readOnly = true)
    public com.example.backend.common.dto.PageResponse<ProductVariantResponse> getAllVariants(String name, int page, int size) {
        String keyword = (name != null && !name.trim().isEmpty()) ? name.trim() : null;
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        org.springframework.data.domain.Page<ProductVariant> variantPage = variantRepository.findAllWithSearch(keyword, pageable);
        org.springframework.data.domain.Page<ProductVariantResponse> responsePage = variantPage.map(variantMapper::toResponse);
        return com.example.backend.common.dto.PageResponse.of(responsePage);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductVariantResponse getVariantById(Long id) {
        ProductVariant variant = getActiveVariantById(id);
        return variantMapper.toResponse(variant);
    }

    @Override
    @Transactional
    public ProductVariantResponse createVariant(ProductVariantRequest request) {
        validateVariantUniqueness(request, null);

        Product product = getProduct(request.getProductId());
        Color color = getColor(request.getColorId());
        Size size = getSize(request.getSizeId());

        ProductVariant variant = variantMapper.toEntity(request);
        variant.setProduct(product);
        variant.setColor(color);
        variant.setSize(size);
        
        String sku = product.getProductCode() + "-" + color.getColorCode() + "-" + size.getSizeCode();
        if (variantRepository.existsBySku(sku)) {
            sku = sku + "-" + java.util.UUID.randomUUID().toString().substring(0, 8);
        }
        variant.setSku(sku);

        ProductVariant savedVariant = variantRepository.save(variant);
        return variantMapper.toResponse(savedVariant);
    }

    @Override
    @Transactional
    public ProductVariantResponse updateVariant(Long id, ProductVariantRequest request) {
        ProductVariant variant = getActiveVariantById(id);

        validateVariantUniqueness(request, id);

        Product product = getProduct(request.getProductId());
        Color color = getColor(request.getColorId());
        Size size = getSize(request.getSizeId());

        variantMapper.updateEntityFromRequest(request, variant);
        
        boolean combinationChanged = !variant.getProduct().getId().equals(product.getId()) ||
                                     !variant.getColor().getId().equals(color.getId()) ||
                                     !variant.getSize().getId().equals(size.getId());

        variant.setProduct(product);
        variant.setColor(color);
        variant.setSize(size);

        if (combinationChanged) {
            String sku = product.getProductCode() + "-" + color.getColorCode() + "-" + size.getSizeCode();
            if (variantRepository.existsBySku(sku)) {
                sku = sku + "-" + java.util.UUID.randomUUID().toString().substring(0, 8);
            }
            variant.setSku(sku);
        }

        ProductVariant updatedVariant = variantRepository.save(variant);
        return variantMapper.toResponse(updatedVariant);
    }

    @Override
    @Transactional
    public void deleteVariant(Long id) {
        ProductVariant variant = getActiveVariantById(id);
        variant.setDeletedAt(LocalDateTime.now());
        variantRepository.save(variant);
    }

    private ProductVariant getActiveVariantById(Long id) {
        return variantRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product variant not found"));
    }

    private Product getProduct(Long id) {
        return productRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    private Color getColor(Long id) {
        return colorRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Color not found"));
    }

    private Size getSize(Long id) {
        return sizeRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Size not found"));
    }

    private void validateVariantUniqueness(ProductVariantRequest request, Long excludeId) {
        if (excludeId == null) {
            if (variantRepository.existsByProductIdAndColorIdAndSizeIdAndDeletedAtIsNull(
                    request.getProductId(), request.getColorId(), request.getSizeId())) {
                throw new BadRequestException("Product variant with this combination already exists");
            }
        } else {
            if (variantRepository.existsByProductIdAndColorIdAndSizeIdAndIdNotAndDeletedAtIsNull(
                    request.getProductId(), request.getColorId(), request.getSizeId(), excludeId)) {
                throw new BadRequestException("Product variant with this combination already exists");
            }
        }
    }
}
