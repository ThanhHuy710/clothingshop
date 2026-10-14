package com.example.backend.colors.repository;

import com.example.backend.colors.entity.Color;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ColorRepository extends JpaRepository<Color, Long> {

    @org.springframework.data.jpa.repository.Query("SELECT c FROM Color c WHERE c.deletedAt IS NULL AND (:name IS NULL OR (LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(c.colorCode) LIKE LOWER(CONCAT('%', :name, '%'))))")
    org.springframework.data.domain.Page<Color> findAllWithSearch(@org.springframework.data.repository.query.Param("name") String name, org.springframework.data.domain.Pageable pageable);

    Optional<Color> findByIdAndDeletedAtIsNull(Long id);

    boolean existsByNameAndDeletedAtIsNull(String name);

    boolean existsByNameAndIdNotAndDeletedAtIsNull(String name, Long id);
    boolean existsByColorCode(String colorCode);
}
