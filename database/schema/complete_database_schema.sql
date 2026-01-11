-- ====================================================================
-- KZN Matric Excellence Database Schema
-- Created: 2026-01-10
-- Description: Complete database schema for student registration system
-- ====================================================================

-- Drop database if exists (USE WITH CAUTION IN PRODUCTION!)
-- DROP DATABASE IF EXISTS `kzn-matric`;

-- Create database
CREATE DATABASE IF NOT EXISTS `kzn-matric` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `kzn-matric`;

-- ====================================================================
-- LOOKUP/REFERENCE TABLES
-- ====================================================================

-- Role types table
CREATE TABLE IF NOT EXISTS `roles` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_role_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default roles
INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'Super Admin', 'Full system access'),
(2, 'Admin', 'Administrative access'),
(3, 'Teacher', 'Instructor/tutor access'),
(4, 'Student', 'Student access')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- User types table
CREATE TABLE IF NOT EXISTS `user_types` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `type_name` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_type_name` (`type_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default user types
INSERT INTO `user_types` (`id`, `type_name`, `description`) VALUES
(1, 'Admin', 'Administrative user'),
(2, 'Student', 'Student user'),
(3, 'Teacher', 'Teacher/Instructor user'),
(4, 'Parent', 'Parent/Guardian user')
ON DUPLICATE KEY UPDATE `type_name`=VALUES(`type_name`);

-- Identity types table
CREATE TABLE IF NOT EXISTS `identity_types` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `type_name` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_identity_type` (`type_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default identity types
INSERT INTO `identity_types` (`id`, `type_name`, `description`) VALUES
(1, 'SA ID', 'South African ID Number'),
(2, 'Passport', 'Passport Number'),
(3, 'Birth Certificate', 'Birth Certificate Number')
ON DUPLICATE KEY UPDATE `type_name`=VALUES(`type_name`);

-- Address types table
CREATE TABLE IF NOT EXISTS `address_types` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `type_name` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_address_type` (`type_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default address types
INSERT INTO `address_types` (`id`, `type_name`, `description`) VALUES
(1, 'Residential', 'Home/Residential address'),
(2, 'Postal', 'Postal/Mailing address'),
(3, 'Business', 'Business address')
ON DUPLICATE KEY UPDATE `type_name`=VALUES(`type_name`);

-- Courses table
CREATE TABLE IF NOT EXISTS `courses` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_course_name` (`name`),
  INDEX `idx_course_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert available courses
INSERT INTO `courses` (`id`, `name`, `description`) VALUES
(1, 'Mathematical Literacy', 'Basic mathematics for everyday life'),
(2, 'Mathematics', 'Advanced mathematics'),
(3, 'Economics', 'Economic theory and principles'),
(4, 'Physical Science', 'Physics and Chemistry'),
(5, 'Accounting', 'Financial accounting and management'),
(6, 'Life Science', 'Biology and life sciences'),
(7, 'English', 'English language and literature'),
(8, 'Agriculture', 'Agricultural sciences'),
(9, 'History', 'Historical studies'),
(10, 'Geography', 'Geographical studies'),
(11, 'Business Studies', 'Business management and entrepreneurship'),
(12, 'isiZulu', 'IsiZulu language'),
(13, 'Tourism', 'Tourism and hospitality')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- ====================================================================
-- MAIN TABLES
-- ====================================================================

-- Users table (Students, Teachers, Admins)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE COMMENT 'Email address used as username',
  `password` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
  `identity_reference` VARCHAR(50) NOT NULL COMMENT 'ID number or passport',
  `identity_type_id` INT UNSIGNED NOT NULL,
  `nationality` VARCHAR(50) NOT NULL,
  `role_id` INT UNSIGNED NOT NULL DEFAULT 4,
  `user_type` INT UNSIGNED NOT NULL DEFAULT 2,
  `is_active` BOOLEAN DEFAULT TRUE,
  `email_verified` BOOLEAN DEFAULT FALSE,
  `id_document_url` VARCHAR(500) NULL COMMENT 'URL to ID document',
  `matric_document_url` VARCHAR(500) NULL COMMENT 'URL to matric certificate',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX `idx_username` (`username`),
  INDEX `idx_user_name` (`first_name`, `last_name`),
  INDEX `idx_identity` (`identity_reference`),
  INDEX `idx_user_active` (`is_active`),

  CONSTRAINT `fk_users_identity_type` FOREIGN KEY (`identity_type_id`) REFERENCES `identity_types`(`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_users_user_type` FOREIGN KEY (`user_type`) REFERENCES `user_types`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contact information table
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NOT NULL COMMENT 'Mobile phone number',
  `tel_no` VARCHAR(20) NULL COMMENT 'Landline/telephone number',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX `idx_contact_user` (`user_id`),
  INDEX `idx_contact_email` (`email`),
  INDEX `idx_contact_phone` (`phone`),

  CONSTRAINT `fk_contacts_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Addresses table
CREATE TABLE IF NOT EXISTS `addresses` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `address_type_id` INT UNSIGNED NOT NULL,
  `address_line_1` VARCHAR(255) NOT NULL COMMENT 'Street address',
  `address_line_2` VARCHAR(255) NULL,
  `city` VARCHAR(100) NOT NULL,
  `province` VARCHAR(100) NOT NULL COMMENT 'State/Province',
  `postal_code` VARCHAR(20) NOT NULL,
  `country` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX `idx_address_user` (`user_id`),
  INDEX `idx_address_type` (`address_type_id`),
  INDEX `idx_address_city` (`city`),

  CONSTRAINT `fk_addresses_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_addresses_type` FOREIGN KEY (`address_type_id`) REFERENCES `address_types`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Schools table
CREATE TABLE IF NOT EXISTS `schools` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `centre_no` VARCHAR(50) NOT NULL COMMENT 'School centre number',
  `school_phone` VARCHAR(20) NOT NULL,
  `school_city` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX `idx_school_name` (`name`),
  INDEX `idx_school_centre` (`centre_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Student schools (relationship)
CREATE TABLE IF NOT EXISTS `student_schools` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL COMMENT 'Student user ID',
  `school_id` INT UNSIGNED NOT NULL,
  `enrollment_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX `idx_student_school_user` (`user_id`),
  INDEX `idx_student_school_school` (`school_id`),
  UNIQUE KEY `uk_student_school` (`user_id`, `school_id`),

  CONSTRAINT `fk_student_schools_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_student_schools_school` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Parents/Guardians table
CREATE TABLE IF NOT EXISTS `parents` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
  `identity_reference` VARCHAR(50) NOT NULL,
  `identity_type_id` INT UNSIGNED NOT NULL,
  `nationality` VARCHAR(50) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `relationship` VARCHAR(50) NOT NULL COMMENT 'Relationship to student',
  `occupation` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX `idx_parent_name` (`first_name`, `last_name`),
  INDEX `idx_parent_identity` (`identity_reference`),

  CONSTRAINT `fk_parents_identity_type` FOREIGN KEY (`identity_type_id`) REFERENCES `identity_types`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Parent addresses table
CREATE TABLE IF NOT EXISTS `parent_addresses` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `parent_id` INT UNSIGNED NOT NULL,
  `address_type_id` INT UNSIGNED NOT NULL,
  `address_line_1` VARCHAR(255) NOT NULL,
  `address_line_2` VARCHAR(255) NULL,
  `city` VARCHAR(100) NOT NULL,
  `province` VARCHAR(100) NOT NULL,
  `postal_code` VARCHAR(20) NOT NULL,
  `country` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX `idx_parent_address_parent` (`parent_id`),

  CONSTRAINT `fk_parent_addresses_parent` FOREIGN KEY (`parent_id`) REFERENCES `parents`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_parent_addresses_type` FOREIGN KEY (`address_type_id`) REFERENCES `address_types`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Student-Parent relationship table
CREATE TABLE IF NOT EXISTS `student_parents` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT UNSIGNED NOT NULL,
  `parent_id` INT UNSIGNED NOT NULL,
  `is_primary` BOOLEAN DEFAULT TRUE COMMENT 'Primary parent/guardian',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX `idx_student_parent_student` (`student_id`),
  INDEX `idx_student_parent_parent` (`parent_id`),
  UNIQUE KEY `uk_student_parent` (`student_id`, `parent_id`),

  CONSTRAINT `fk_student_parents_student` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_student_parents_parent` FOREIGN KEY (`parent_id`) REFERENCES `parents`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Student courses (interested courses)
CREATE TABLE IF NOT EXISTS `student_courses` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT UNSIGNED NOT NULL,
  `course_id` INT UNSIGNED NOT NULL,
  `enrollment_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('Active', 'Completed', 'Dropped') DEFAULT 'Active',

  INDEX `idx_student_course_student` (`student_id`),
  INDEX `idx_student_course_course` (`course_id`),
  INDEX `idx_student_course_status` (`status`),
  UNIQUE KEY `uk_student_course` (`student_id`, `course_id`),

  CONSTRAINT `fk_student_courses_student` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_student_courses_course` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- INDEXES FOR PERFORMANCE
-- ====================================================================

-- Add composite indexes for common queries
CREATE INDEX `idx_users_role_type` ON `users`(`role_id`, `user_type`);
CREATE INDEX `idx_users_created` ON `users`(`created_at`);
CREATE INDEX `idx_contacts_user_email` ON `contacts`(`user_id`, `email`);
CREATE INDEX `idx_addresses_user_type` ON `addresses`(`user_id`, `address_type_id`);

-- ====================================================================
-- SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ====================================================================

-- Create a default admin user
-- Password: admin123 (hashed with bcrypt - YOU MUST CHANGE THIS!)
-- INSERT INTO `users` (`username`, `password`, `first_name`, `last_name`, `gender`, `identity_reference`, `identity_type_id`, `nationality`, `role_id`, `user_type`)
-- VALUES ('admin@knmatricexcellence.co.za', '$2b$10$YourHashedPasswordHere', 'Admin', 'User', 'Male', '0000000000000', 1, 'African', 1, 1);

-- ====================================================================
-- VIEWS FOR COMMON QUERIES
-- ====================================================================

-- Student profile view
CREATE OR REPLACE VIEW `v_student_profiles` AS
SELECT
    u.id,
    u.username,
    u.first_name,
    u.last_name,
    u.gender,
    u.identity_reference,
    u.nationality,
    c.email,
    c.phone,
    c.tel_no,
    a.address_line_1,
    a.city,
    a.province,
    a.postal_code,
    a.country,
    u.id_document_url,
    u.matric_document_url,
    u.is_active,
    u.created_at
FROM users u
LEFT JOIN contacts c ON u.id = c.user_id
LEFT JOIN addresses a ON u.id = a.user_id AND a.address_type_id = 1
WHERE u.user_type = 2;

-- ====================================================================
-- COMPLETION MESSAGE
-- ====================================================================

SELECT 'Database schema created successfully!' AS Status;
