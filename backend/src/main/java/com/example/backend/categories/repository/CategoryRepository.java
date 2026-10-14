package com.example.backend.categories.repository;

import com.example.backend.categories.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsBySlug(String slug);
    boolean existsBySlugAndIdNot(String slug, Long id);

    @org.springframework.data.jpa.repository.Query("SELECT c FROM Category c WHERE (:name IS NULL OR (LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(c.categoryCode) LIKE LOWER(CONCAT('%', :name, '%'))))")
    org.springframework.data.domain.Page<Category> findAllWithSearch(@org.springframework.data.repository.query.Param("name") String name, org.springframework.data.domain.Pageable pageable);
}
