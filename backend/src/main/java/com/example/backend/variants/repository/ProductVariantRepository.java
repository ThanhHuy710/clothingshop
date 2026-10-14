package com.example.backend.variants.repository;

import com.example.backend.variants.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    @org.springframework.data.jpa.repository.Query("SELECT v FROM ProductVariant v WHERE v.deletedAt IS NULL AND (:name IS NULL OR LOWER(v.sku) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(v.product.name) LIKE LOWER(CONCAT('%', :name, '%')))")
    org.springframework.data.domain.Page<ProductVariant> findAllWithSearch(@org.springframework.data.repository.query.Param("name") String name, org.springframework.data.domain.Pageable pageable);

    Optional<ProductVariant> findByIdAndDeletedAtIsNull(Long id);

    boolean existsBySkuAndDeletedAtIsNull(String sku);

    boolean existsBySkuAndIdNotAndDeletedAtIsNull(String sku, Long id);

    boolean existsByProductIdAndColorIdAndSizeIdAndDeletedAtIsNull(Long productId, Long colorId, Long sizeId);

    boolean existsByProductIdAndColorIdAndSizeIdAndIdNotAndDeletedAtIsNull(Long productId, Long colorId, Long sizeId, Long id);
    boolean existsBySku(String sku);
}
