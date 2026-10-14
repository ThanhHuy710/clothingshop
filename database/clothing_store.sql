/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80044
 Source Host           : localhost:3306
 Source Schema         : clothing_store

 Target Server Type    : MySQL
 Target Server Version : 80044
 File Encoding         : 65001

 Date: 14/10/2026 16:51:35
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `parent_id` bigint NULL DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `image_public_id` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_categories_slug`(`slug` ASC) USING BTREE,
  UNIQUE INDEX `category_code`(`category_code` ASC) USING BTREE,
  INDEX `idx_categories_parent_id`(`parent_id` ASC) USING BTREE,
  CONSTRAINT `fk_categories_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for colors
-- ----------------------------
DROP TABLE IF EXISTS `colors`;
CREATE TABLE `colors`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `color_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_colors_name`(`name` ASC) USING BTREE,
  UNIQUE INDEX `color_code`(`color_code` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for product_images
-- ----------------------------
DROP TABLE IF EXISTS `product_images`;
CREATE TABLE `product_images`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint NOT NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `public_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `sort_order` int NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `color_id` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_product_images_product_id`(`product_id` ASC) USING BTREE,
  INDEX `idx_product_images_primary`(`product_id` ASC, `is_primary` ASC) USING BTREE,
  INDEX `FKqci3amfq4s9m0g7l3tipml59e`(`color_id` ASC) USING BTREE,
  CONSTRAINT `fk_product_images_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FKqci3amfq4s9m0g7l3tipml59e` FOREIGN KEY (`color_id`) REFERENCES `colors` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `chk_product_images_sort_order` CHECK (`sort_order` >= 0)
) ENGINE = InnoDB AUTO_INCREMENT = 420 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for product_variants
-- ----------------------------
DROP TABLE IF EXISTS `product_variants`;
CREATE TABLE `product_variants`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint NOT NULL,
  `color_id` bigint NOT NULL,
  `size_id` bigint NOT NULL,
  `sku` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(15, 2) NOT NULL,
  `quantity` int NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_product_variants_sku`(`sku` ASC) USING BTREE,
  UNIQUE INDEX `uk_product_color_size`(`product_id` ASC, `color_id` ASC, `size_id` ASC) USING BTREE,
  INDEX `idx_variants_product_id`(`product_id` ASC) USING BTREE,
  INDEX `idx_variants_color_id`(`color_id` ASC) USING BTREE,
  INDEX `idx_variants_size_id`(`size_id` ASC) USING BTREE,
  INDEX `idx_variants_product_color`(`product_id` ASC, `color_id` ASC) USING BTREE,
  CONSTRAINT `fk_variants_color` FOREIGN KEY (`color_id`) REFERENCES `colors` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_variants_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_variants_size` FOREIGN KEY (`size_id`) REFERENCES `sizes` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `chk_variants_price` CHECK (`price` >= 0),
  CONSTRAINT `chk_variants_quantity` CHECK (`quantity` >= 0)
) ENGINE = InnoDB AUTO_INCREMENT = 808 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` bigint NOT NULL,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `gender` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime(6) NULL DEFAULT NULL,
  `best_seller` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_products_slug`(`slug` ASC) USING BTREE,
  UNIQUE INDEX `product_code`(`product_code` ASC) USING BTREE,
  INDEX `idx_products_category_id`(`category_id` ASC) USING BTREE,
  INDEX `idx_products_status`(`status` ASC) USING BTREE,
  INDEX `idx_products_gender`(`gender` ASC) USING BTREE,
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `chk_products_gender` CHECK ((`gender` is null) or (`gender` in (_utf8mb4'MALE',_utf8mb4'FEMALE',_utf8mb4'UNISEX'))),
  CONSTRAINT `chk_products_status` CHECK (`status` in (_utf8mb4'ACTIVE',_utf8mb4'INACTIVE'))
) ENGINE = InnoDB AUTO_INCREMENT = 216 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_roles_name`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for sizes
-- ----------------------------
DROP TABLE IF EXISTS `sizes`;
CREATE TABLE `sizes`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `size_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT 0,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_sizes_name`(`name` ASC) USING BTREE,
  UNIQUE INDEX `size_code`(`size_code` ASC) USING BTREE,
  CONSTRAINT `chk_sizes_sort_order` CHECK (`sort_order` >= 0)
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_id` bigint NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_users_username`(`username` ASC) USING BTREE,
  INDEX `idx_users_role_id`(`role_id` ASC) USING BTREE,
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Procedure structure for generate_sample_products
-- ----------------------------
DROP PROCEDURE IF EXISTS `generate_sample_products`;
delimiter ;;
CREATE PROCEDURE `generate_sample_products`(IN p_total_products INT)
BEGIN

    DECLARE i INT DEFAULT 1;

    DECLARE v_product_id BIGINT;
    DECLARE v_category_id BIGINT;
    DECLARE v_color_id BIGINT;
    DECLARE v_size_id BIGINT;

    DECLARE v_category_slug VARCHAR(150);
    DECLARE v_category_name VARCHAR(100);

    DECLARE v_color_name VARCHAR(50);
    DECLARE v_size_name VARCHAR(20);

    DECLARE v_product_name VARCHAR(200);
    DECLARE v_slug VARCHAR(250);
    DECLARE v_sku VARCHAR(100);

    DECLARE v_price DECIMAL(15,2);

    -- -----------------------------------------------------
    -- Product name templates
    -- -----------------------------------------------------

    DECLARE v_name_prefix VARCHAR(100);

    SET v_name_prefix = '';


    -- -----------------------------------------------------
    -- Generate products
    -- -----------------------------------------------------

    WHILE i <= p_total_products DO

        -- =================================================
        -- RANDOM CATEGORY
        -- Chỉ lấy category con từ ID 5 trở đi
        -- =================================================

        SELECT
            id,
            name,
            slug
        INTO
            v_category_id,
            v_category_name,
            v_category_slug
        FROM categories
        WHERE id >= 5
        ORDER BY RAND()
        LIMIT 1;


        -- =================================================
        -- PRODUCT NAME
        -- =================================================

        SET v_product_name = CONCAT(
            v_category_name,
            ' ',
            CASE MOD(i, 10)
                WHEN 0 THEN 'Basic'
                WHEN 1 THEN 'Premium'
                WHEN 2 THEN 'Classic'
                WHEN 3 THEN 'Modern'
                WHEN 4 THEN 'Essential'
                WHEN 5 THEN 'Slim Fit'
                WHEN 6 THEN 'Comfort'
                WHEN 7 THEN 'Street Style'
                WHEN 8 THEN 'Elegant'
                ELSE 'Fashion'
            END,
            ' ',
            LPAD(i, 3, '0')
        );


        -- =================================================
        -- SLUG
        -- =================================================

        SET v_slug = CONCAT(
            v_category_slug,
            '-',
            CASE MOD(i, 10)
                WHEN 0 THEN 'basic'
                WHEN 1 THEN 'premium'
                WHEN 2 THEN 'classic'
                WHEN 3 THEN 'modern'
                WHEN 4 THEN 'essential'
                WHEN 5 THEN 'slim-fit'
                WHEN 6 THEN 'comfort'
                WHEN 7 THEN 'street-style'
                WHEN 8 THEN 'elegant'
                ELSE 'fashion'
            END,
            '-',
            LPAD(i, 3, '0')
        );


        -- =================================================
        -- INSERT PRODUCT
        -- =================================================

        INSERT INTO products (
            category_id,
            name,
            slug,
            description,
            gender,
            status
        )
        VALUES (
            v_category_id,

            v_product_name,

            v_slug,

            CONCAT(
                'Sản phẩm ',
                v_product_name,
                '. ',
                'Thiết kế hiện đại, chất liệu cao cấp, ',
                'phù hợp sử dụng hàng ngày.'
            ),

            CASE MOD(i, 3)
                WHEN 0 THEN 'MALE'
                WHEN 1 THEN 'FEMALE'
                ELSE 'UNISEX'
            END,

            'ACTIVE'
        );


        -- =================================================
        -- GET PRODUCT ID
        -- =================================================

        SET v_product_id = LAST_INSERT_ID();


        -- =================================================
        -- RANDOM PRICE
        -- =================================================

        SET v_price =
            CASE MOD(i, 8)
                WHEN 0 THEN 199000
                WHEN 1 THEN 249000
                WHEN 2 THEN 299000
                WHEN 3 THEN 349000
                WHEN 4 THEN 399000
                WHEN 5 THEN 449000
                WHEN 6 THEN 499000
                ELSE 599000
            END;


        -- =================================================
        -- VARIANT 1
        -- =================================================

        SELECT id, name
        INTO v_color_id, v_color_name
        FROM colors
        ORDER BY RAND()
        LIMIT 1;

        SELECT id, name
        INTO v_size_id, v_size_name
        FROM sizes
        WHERE name IN ('S', 'M', 'L')
        ORDER BY RAND()
        LIMIT 1;


        SET v_sku = CONCAT(
            'SKU-',
            LPAD(v_product_id, 5, '0'),
            '-',
            UPPER(SUBSTRING(v_color_name, 1, 3)),
            '-',
            v_size_name
        );


        INSERT INTO product_variants (
            product_id,
            color_id,
            size_id,
            sku,
            price,
            quantity
        )
        VALUES (
            v_product_id,
            v_color_id,
            v_size_id,
            v_sku,
            v_price,
            FLOOR(10 + RAND() * 91)
        );


        -- =================================================
        -- VARIANT 2
        -- =================================================

        SELECT id, name
        INTO v_color_id, v_color_name
        FROM colors
        ORDER BY RAND()
        LIMIT 1;

        SELECT id, name
        INTO v_size_id, v_size_name
        FROM sizes
        WHERE name IN ('S', 'M', 'L')
        ORDER BY RAND()
        LIMIT 1;


        SET v_sku = CONCAT(
            'SKU-',
            LPAD(v_product_id, 5, '0'),
            '-',
            UPPER(SUBSTRING(v_color_name, 1, 3)),
            '-',
            v_size_name
        );


        INSERT IGNORE INTO product_variants (
            product_id,
            color_id,
            size_id,
            sku,
            price,
            quantity
        )
        VALUES (
            v_product_id,
            v_color_id,
            v_size_id,
            v_sku,
            v_price,
            FLOOR(10 + RAND() * 91)
        );


        -- =================================================
        -- VARIANT 3
        -- =================================================

        SELECT id, name
        INTO v_color_id, v_color_name
        FROM colors
        ORDER BY RAND()
        LIMIT 1;

        SELECT id, name
        INTO v_size_id, v_size_name
        FROM sizes
        ORDER BY RAND()
        LIMIT 1;


        SET v_sku = CONCAT(
            'SKU-',
            LPAD(v_product_id, 5, '0'),
            '-',
            UPPER(SUBSTRING(v_color_name, 1, 3)),
            '-',
            v_size_name
        );


        INSERT IGNORE INTO product_variants (
            product_id,
            color_id,
            size_id,
            sku,
            price,
            quantity
        )
        VALUES (
            v_product_id,
            v_color_id,
            v_size_id,
            v_sku,
            v_price,
            FLOOR(10 + RAND() * 91)
        );


        -- =================================================
        -- VARIANT 4
        -- =================================================

        SELECT id, name
        INTO v_color_id, v_color_name
        FROM colors
        ORDER BY RAND()
        LIMIT 1;

        SELECT id, name
        INTO v_size_id, v_size_name
        FROM sizes
        ORDER BY RAND()
        LIMIT 1;


        SET v_sku = CONCAT(
            'SKU-',
            LPAD(v_product_id, 5, '0'),
            '-',
            UPPER(SUBSTRING(v_color_name, 1, 3)),
            '-',
            v_size_name
        );


        INSERT IGNORE INTO product_variants (
            product_id,
            color_id,
            size_id,
            sku,
            price,
            quantity
        )
        VALUES (
            v_product_id,
            v_color_id,
            v_size_id,
            v_sku,
            v_price,
            FLOOR(10 + RAND() * 91)
        );


        -- =================================================
        -- PRODUCT IMAGE 1
        -- =================================================

        INSERT INTO product_images (
            product_id,
            image_url,
            public_id,
            is_primary,
            sort_order
        )
        VALUES (
            v_product_id,

            CONCAT(
                'https://res.cloudinary.com/demo/image/upload/',
                'clothing-store/product-',
                v_product_id,
                '-1.jpg'
            ),

            CONCAT(
                'clothing-store/product-',
                v_product_id,
                '-1'
            ),

            TRUE,

            1
        );


        -- =================================================
        -- PRODUCT IMAGE 2
        -- =================================================

        INSERT INTO product_images (
            product_id,
            image_url,
            public_id,
            is_primary,
            sort_order
        )
        VALUES (
            v_product_id,

            CONCAT(
                'https://res.cloudinary.com/demo/image/upload/',
                'clothing-store/product-',
                v_product_id,
                '-2.jpg'
            ),

            CONCAT(
                'clothing-store/product-',
                v_product_id,
                '-2'
            ),

            FALSE,

            2
        );


        -- =================================================
        -- NEXT PRODUCT
        -- =================================================

        SET i = i + 1;

    END WHILE;

END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
