package com.example.backend.colors.service;

import com.example.backend.colors.dto.ColorRequest;
import com.example.backend.colors.dto.ColorResponse;
import com.example.backend.colors.entity.Color;
import com.example.backend.colors.mapper.ColorMapper;
import com.example.backend.colors.repository.ColorRepository;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ColorServiceImpl implements ColorService {

    private final ColorRepository colorRepository;
    private final ColorMapper colorMapper;

    @Override
    @Transactional(readOnly = true)
    public com.example.backend.common.dto.PageResponse<ColorResponse> getAllColors(String name, int page, int size) {
        String keyword = (name != null && !name.trim().isEmpty()) ? name.trim() : null;
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        org.springframework.data.domain.Page<Color> colorPage = colorRepository.findAllWithSearch(keyword, pageable);
        org.springframework.data.domain.Page<ColorResponse> responsePage = colorPage.map(colorMapper::toResponse);
        return com.example.backend.common.dto.PageResponse.of(responsePage);
    }

    @Override
    @Transactional(readOnly = true)
    public ColorResponse getColorById(Long id) {
        Color color = getActiveColorById(id);
        return colorMapper.toResponse(color);
    }

    @Override
    @Transactional
    public ColorResponse createColor(ColorRequest request) {
        if (colorRepository.existsByNameAndDeletedAtIsNull(request.getName())) {
            throw new BadRequestException("Color name already exists");
        }

        Color color = colorMapper.toEntity(request);
        Color savedColor = colorRepository.save(color);
        String name = savedColor.getName().toUpperCase();
        String code = "C" + String.format("%03d", savedColor.getId());
        if (name.contains("ĐỎ ĐẬM")) code = "DRD";
        else if (name.contains("TRẮNG")) code = "WHT";
        else if (name.contains("ĐỎ TÍA")) code = "MRO";
        else if (name.contains("ĐỎ")) code = "RED";
        else if (name.contains("XANH DƯƠNG")) code = "BLU";
        else if (name.contains("XANH LÁ")) code = "GRN";
        else if (name.contains("VÀNG")) code = "YLW";
        else if (name.contains("HỒNG")) code = "PNK";
        else if (name.contains("XÁM")) code = "GRY";
        else if (name.contains("BE")) code = "BEI";
        else if (name.contains("NÂU")) code = "BRN";
        else if (name.contains("CAM")) code = "ORG";
        else if (name.contains("TÍM")) code = "PUR";
        
        if (colorRepository.existsByColorCode(code)) {
            code = code + "-" + savedColor.getId();
        }
        savedColor.setColorCode(code);
        savedColor = colorRepository.save(savedColor);
        return colorMapper.toResponse(savedColor);
    }

    @Override
    @Transactional
    public ColorResponse updateColor(Long id, ColorRequest request) {
        Color color = getActiveColorById(id);

        if (colorRepository.existsByNameAndIdNotAndDeletedAtIsNull(request.getName(), id)) {
            throw new BadRequestException("Color name already exists");
        }

        colorMapper.updateEntityFromRequest(request, color);
        Color updatedColor = colorRepository.save(color);
        return colorMapper.toResponse(updatedColor);
    }

    @Override
    @Transactional
    public void deleteColor(Long id) {
        Color color = getActiveColorById(id);
        color.setDeletedAt(LocalDateTime.now());
        colorRepository.save(color);
    }

    private Color getActiveColorById(Long id) {
        return colorRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Color not found"));
    }
}
