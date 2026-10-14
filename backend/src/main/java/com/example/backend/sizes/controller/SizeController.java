package com.example.backend.sizes.controller;

import com.example.backend.sizes.dto.SizeRequest;
import com.example.backend.sizes.dto.SizeResponse;
import com.example.backend.sizes.service.SizeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sizes")
@RequiredArgsConstructor
public class SizeController {

    private final SizeService sizeService;

    @GetMapping
    public ResponseEntity<com.example.backend.common.dto.PageResponse<SizeResponse>> getAllSizes(
            @RequestParam(required = false) String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        if (size > 100) size = 100;
        return ResponseEntity.ok(sizeService.getAllSizes(name, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SizeResponse> getSizeById(@PathVariable Long id) {
        return ResponseEntity.ok(sizeService.getSizeById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SizeResponse> createSize(@Valid @RequestBody SizeRequest request) {
        return new ResponseEntity<>(sizeService.createSize(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SizeResponse> updateSize(
            @PathVariable Long id,
            @Valid @RequestBody SizeRequest request) {
        return ResponseEntity.ok(sizeService.updateSize(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSize(@PathVariable Long id) {
        sizeService.deleteSize(id);
        return ResponseEntity.noContent().build();
    }
}
