package com.example.backend.sizes.mapper;

import com.example.backend.sizes.dto.SizeRequest;
import com.example.backend.sizes.dto.SizeResponse;
import com.example.backend.sizes.entity.Size;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface SizeMapper {

    SizeResponse toResponse(Size size);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    Size toEntity(SizeRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    void updateEntityFromRequest(SizeRequest request, @MappingTarget Size size);
}
