package com.example.backend.products.mapper;

import com.example.backend.products.dto.ProductRequest;
import com.example.backend.products.dto.ProductResponse;
import com.example.backend.products.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import java.util.stream.Collectors;
import com.example.backend.productimages.entity.ProductImage;
import com.example.backend.variants.entity.ProductVariant;

@Mapper(componentModel = "spring")
public interface ProductMapper {

        @org.mapstruct.AfterMapping
    default void mapPriceAndImages(Product product, @MappingTarget ProductResponse response) {
        if (product.getVariants() != null && !product.getVariants().isEmpty()) {
            response.setPrice(product.getVariants().stream()
                .map(ProductVariant::getPrice)
                .min(java.util.Comparator.naturalOrder())
                .orElse(java.math.BigDecimal.ZERO));
        } else {
            response.setPrice(java.math.BigDecimal.ZERO);
        }
        
                if (product.getVariants() != null && !product.getVariants().isEmpty()) {
            response.setVariants(product.getVariants().stream().map(v -> {
                com.example.backend.variants.dto.ProductVariantResponse vr = new com.example.backend.variants.dto.ProductVariantResponse();
                vr.setId(v.getId());
                vr.setProductId(product.getId());
                if (v.getColor() != null) {
                    vr.setColorId(v.getColor().getId());
                    vr.setColorName(v.getColor().getName());
                }
                if (v.getSize() != null) {
                    vr.setSizeId(v.getSize().getId());
                    vr.setSizeName(v.getSize().getName());
                }
                vr.setSku(v.getSku());
                vr.setPrice(v.getPrice());
                vr.setQuantity(v.getQuantity());
                return vr;
            }).collect(Collectors.toList()));
        }

        if (product.getImages() != null && !product.getImages().isEmpty()) {
            response.setImageDetails(product.getImages().stream().map(i -> {
                com.example.backend.productimages.dto.ProductImageResponse ir = new com.example.backend.productimages.dto.ProductImageResponse();
                ir.setId(i.getId());
                ir.setProductId(product.getId());
                if (i.getColor() != null) {
                    ir.setColorId(i.getColor().getId());
                }
                ir.setImageUrl(i.getImageUrl());
                ir.setPrimary(i.isPrimary());
                return ir;
            }).collect(Collectors.toList()));
        }

        if (product.getImages() != null && !product.getImages().isEmpty()) {
            response.setImages(product.getImages().stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList()));
        } else {
            response.setImages(java.util.Collections.emptyList());
        }
    }

    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "variants", ignore = true)
    @Mapping(target = "imageDetails", ignore = true)
    @Mapping(target = "price", ignore = true)
    ProductResponse toResponse(Product product);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    Product toEntity(ProductRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    void updateEntityFromRequest(ProductRequest request, @MappingTarget Product product);
}
