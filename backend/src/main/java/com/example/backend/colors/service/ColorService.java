package com.example.backend.colors.service;

import com.example.backend.colors.dto.ColorRequest;
import com.example.backend.colors.dto.ColorResponse;

import java.util.List;

import com.example.backend.common.dto.PageResponse;

public interface ColorService {

    PageResponse<ColorResponse> getAllColors(String name, int page, int size);

    ColorResponse getColorById(Long id);

    ColorResponse createColor(ColorRequest request);

    ColorResponse updateColor(Long id, ColorRequest request);

    void deleteColor(Long id);
}
