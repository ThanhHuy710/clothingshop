package com.example.backend.productimages.mapper;

import com.example.backend.productimages.dto.ProductImageResponse;
import com.example.backend.productimages.entity.ProductImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProductImageMapper {

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "color.id", target = "colorId")
    ProductImageResponse toResponse(ProductImage entity);

    List<ProductImageResponse> toResponseList(List<ProductImage> entities);
}
