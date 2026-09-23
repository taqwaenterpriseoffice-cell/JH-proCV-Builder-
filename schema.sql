-- JH Soft CV Database Schema for MySQL (Hostinger Compatible)
-- Character Set: utf8mb4 for full Bengali and multilingual support

CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) NOT NULL,
  `shop_name` VARCHAR(191) NOT NULL,
  `owner_name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `phone` VARCHAR(64) NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `address` TEXT NULL,
  `gemini_api_key` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `resumes` (
  `id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `theme` VARCHAR(64) NOT NULL DEFAULT 'modern',
  `font` VARCHAR(64) NOT NULL DEFAULT 'Inter',
  `language` VARCHAR(16) NOT NULL DEFAULT 'en',
  `accent_color` VARCHAR(32) NOT NULL DEFAULT '#2563eb',
  `font_size` VARCHAR(16) NOT NULL DEFAULT 'normal',
  `data_json` LONGTEXT NOT NULL,
  `print_options_json` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_resumes_user_id` (`user_id`),
  CONSTRAINT `fk_resumes_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
