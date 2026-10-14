package com.example.backend.products.repository;

import com.example.backend.products.entity.Product;
import com.example.backend.variants.entity.ProductVariant;
import jakarta.persistence.criteria.Subquery;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecification {

    public static Specification<Product> hasName(String name) {
        return (root, query, cb) -> {
            if (name == null || name.trim().isEmpty()) return cb.conjunction();
            String keyword = "%" + name.trim() + "%";
            return cb.or(
                cb.like(cb.lower(root.get("name")), cb.lower(cb.literal(keyword))),
                cb.like(cb.lower(root.get("productCode")), cb.lower(cb.literal(keyword)))
            );
        };
    }

    public static Specification<Product> hasCategoryId(Long categoryId) {
        return (root, query, cb) -> {
            if (categoryId == null) return cb.conjunction();
            return cb.equal(root.get("category").get("id"), categoryId);
        };
    }

    public static Specification<Product> hasGender(String gender) {
        return (root, query, cb) -> {
            if (gender == null || gender.isEmpty()) return cb.conjunction();
            return cb.equal(root.get("gender"), gender);
        };
    }

    public static Specification<Product> hasColorId(Long colorId) {
        return (root, query, cb) -> {
            if (colorId == null) return cb.conjunction();
            Subquery<Long> subquery = query.subquery(Long.class);
            Root<ProductVariant> variantRoot = subquery.from(ProductVariant.class);
            subquery.select(variantRoot.get("product").get("id"))
                    .where(cb.equal(variantRoot.get("color").get("id"), colorId));
            return root.get("id").in(subquery);
        };
    }

        public static Specification<Product> hasSizeId(Long sizeId) {
        return (root, query, cb) -> {
            if (sizeId == null) return cb.conjunction();
            Subquery<Long> subquery = query.subquery(Long.class);
            Root<ProductVariant> variantRoot = subquery.from(ProductVariant.class);
            subquery.select(variantRoot.get("product").get("id"))
                    .where(cb.equal(variantRoot.get("size").get("id"), sizeId));
            return root.get("id").in(subquery);
        };
    }

    public static Specification<Product> hasPriceBetween(java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice) {
        return (root, query, cb) -> {
            if (minPrice == null && maxPrice == null) return cb.conjunction();
            Subquery<Long> subquery = query.subquery(Long.class);
            Root<ProductVariant> variantRoot = subquery.from(ProductVariant.class);
            
            jakarta.persistence.criteria.Predicate pricePredicate = cb.conjunction();
            if (minPrice != null) {
                pricePredicate = cb.and(pricePredicate, cb.greaterThanOrEqualTo(variantRoot.get("price"), minPrice));
            }
            if (maxPrice != null) {
                pricePredicate = cb.and(pricePredicate, cb.lessThanOrEqualTo(variantRoot.get("price"), maxPrice));
            }
            
            subquery.select(variantRoot.get("product").get("id"))
                    .where(pricePredicate);
            return root.get("id").in(subquery);
        };
    }

    public static Specification<Product> isNotDeleted() {
        return (root, query, cb) -> cb.isNull(root.get("deletedAt"));
    }

    public static Specification<Product> isBestSeller(Boolean bestSeller) {
        return (root, query, cb) -> {
            if (bestSeller == null) return cb.conjunction();
            return cb.equal(root.get("bestSeller"), bestSeller);
        };
    }
}
