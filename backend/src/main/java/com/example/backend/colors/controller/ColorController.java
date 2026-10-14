package com.example.backend.colors.controller;

import com.example.backend.colors.dto.ColorRequest;
import com.example.backend.colors.dto.ColorResponse;
import com.example.backend.colors.service.ColorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/colors")
@RequiredArgsConstructor
public class ColorController {

    private final ColorService colorService;

    @GetMapping
    public ResponseEntity<com.example.backend.common.dto.PageResponse<ColorResponse>> getAllColors(
            @RequestParam(required = false) String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        if (size > 100) size = 100;
        return ResponseEntity.ok(colorService.getAllColors(name, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ColorResponse> getColorById(@PathVariable Long id) {
        return ResponseEntity.ok(colorService.getColorById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ColorResponse> createColor(@Valid @RequestBody ColorRequest request) {
        return new ResponseEntity<>(colorService.createColor(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ColorResponse> updateColor(
            @PathVariable Long id,
            @Valid @RequestBody ColorRequest request) {
        return ResponseEntity.ok(colorService.updateColor(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteColor(@PathVariable Long id) {
        colorService.deleteColor(id);
        return ResponseEntity.noContent().build();
    }
}
