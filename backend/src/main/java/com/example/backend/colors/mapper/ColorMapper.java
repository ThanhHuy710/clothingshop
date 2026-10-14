package com.example.backend.colors.mapper;

import com.example.backend.colors.dto.ColorRequest;
import com.example.backend.colors.dto.ColorResponse;
import com.example.backend.colors.entity.Color;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ColorMapper {

    ColorResponse toResponse(Color color);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    Color toEntity(ColorRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    void updateEntityFromRequest(ColorRequest request, @MappingTarget Color color);
}
