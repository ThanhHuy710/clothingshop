package com.example.backend.sizes.service;

import com.example.backend.sizes.dto.SizeRequest;
import com.example.backend.sizes.dto.SizeResponse;

import java.util.List;

import com.example.backend.common.dto.PageResponse;

public interface SizeService {

    PageResponse<SizeResponse> getAllSizes(String name, int page, int size);

    SizeResponse getSizeById(Long id);

    SizeResponse createSize(SizeRequest request);

    SizeResponse updateSize(Long id, SizeRequest request);

    void deleteSize(Long id);
}
