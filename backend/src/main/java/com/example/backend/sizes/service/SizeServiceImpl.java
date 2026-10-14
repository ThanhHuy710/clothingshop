package com.example.backend.sizes.service;

import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.sizes.dto.SizeRequest;
import com.example.backend.sizes.dto.SizeResponse;
import com.example.backend.sizes.entity.Size;
import com.example.backend.sizes.mapper.SizeMapper;
import com.example.backend.sizes.repository.SizeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SizeServiceImpl implements SizeService {

    private final SizeRepository sizeRepository;
    private final SizeMapper sizeMapper;

    @Override
    @Transactional(readOnly = true)
    public com.example.backend.common.dto.PageResponse<SizeResponse> getAllSizes(String name, int page, int size) {
        String keyword = (name != null && !name.trim().isEmpty()) ? name.trim() : null;
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        org.springframework.data.domain.Page<Size> sizePage = sizeRepository.findAllWithSearch(keyword, pageable);
        org.springframework.data.domain.Page<SizeResponse> responsePage = sizePage.map(sizeMapper::toResponse);
        return com.example.backend.common.dto.PageResponse.of(responsePage);
    }

    @Override
    @Transactional(readOnly = true)
    public SizeResponse getSizeById(Long id) {
        Size size = getActiveSizeById(id);
        return sizeMapper.toResponse(size);
    }

    @Override
    @Transactional
    public SizeResponse createSize(SizeRequest request) {
        if (sizeRepository.existsByNameAndDeletedAtIsNull(request.getName())) {
            throw new BadRequestException("Size name already exists");
        }

        Size size = sizeMapper.toEntity(request);
        Size savedSize = sizeRepository.save(size);
        String code = savedSize.getName().toUpperCase();
        if (sizeRepository.existsBySizeCode(code)) {
            code = code + "-" + savedSize.getId();
        }
        savedSize.setSizeCode(code);
        savedSize = sizeRepository.save(savedSize);
        return sizeMapper.toResponse(savedSize);
    }

    @Override
    @Transactional
    public SizeResponse updateSize(Long id, SizeRequest request) {
        Size size = getActiveSizeById(id);

        if (sizeRepository.existsByNameAndIdNotAndDeletedAtIsNull(request.getName(), id)) {
            throw new BadRequestException("Size name already exists");
        }

        sizeMapper.updateEntityFromRequest(request, size);
        Size updatedSize = sizeRepository.save(size);
        return sizeMapper.toResponse(updatedSize);
    }

    @Override
    @Transactional
    public void deleteSize(Long id) {
        Size size = getActiveSizeById(id);
        size.setDeletedAt(LocalDateTime.now());
        sizeRepository.save(size);
    }

    private Size getActiveSizeById(Long id) {
        return sizeRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Size not found"));
    }
}
