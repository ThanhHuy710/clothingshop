package com.example.backend.sizes.repository;

import com.example.backend.sizes.entity.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SizeRepository extends JpaRepository<Size, Long> {

    @org.springframework.data.jpa.repository.Query("SELECT s FROM Size s WHERE s.deletedAt IS NULL AND (:name IS NULL OR (LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(s.sizeCode) LIKE LOWER(CONCAT('%', :name, '%'))))")
    org.springframework.data.domain.Page<Size> findAllWithSearch(@org.springframework.data.repository.query.Param("name") String name, org.springframework.data.domain.Pageable pageable);

    Optional<Size> findByIdAndDeletedAtIsNull(Long id);

    boolean existsByNameAndDeletedAtIsNull(String name);

    boolean existsByNameAndIdNotAndDeletedAtIsNull(String name, Long id);
    boolean existsBySizeCode(String sizeCode);
}
