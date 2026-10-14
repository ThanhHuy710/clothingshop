package com.example.backend.categories.mapper;

import com.example.backend.categories.dto.CategoryRequest;
import com.example.backend.categories.dto.CategoryResponse;
import com.example.backend.categories.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    CategoryResponse toResponse(Category category);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "imageUrl", ignore = true)
    @Mapping(target = "imagePublicId", ignore = true)
    Category toEntity(CategoryRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "imageUrl", ignore = true)
    @Mapping(target = "imagePublicId", ignore = true)
    void updateEntityFromRequest(CategoryRequest request, @MappingTarget Category category);
}
