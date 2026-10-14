package com.example.backend.productimages.repository;

import com.example.backend.productimages.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {

    List<ProductImage> findByProductId(Long productId);

    boolean existsByProductIdAndColorIdAndIsPrimaryTrue(Long productId, Long colorId);
    boolean existsByProductIdAndIsPrimaryTrue(Long productId);
}
