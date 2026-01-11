-- ====================================================================
-- Verification Script for KZN Matric Excellence Database
-- ====================================================================

USE `kzn-matric`;

-- Check if database exists and is selected
SELECT DATABASE() AS 'Current Database';

-- Show all tables
SELECT 'All Tables:' AS '';
SHOW TABLES;

-- Count tables (should be 14)
SELECT COUNT(*) AS 'Total Tables' FROM information_schema.tables
WHERE table_schema = 'kzn-matric';

-- Check each table structure
SELECT '\n=== USERS TABLE ===' AS '';
DESCRIBE users;

SELECT '\n=== CONTACTS TABLE ===' AS '';
DESCRIBE contacts;

SELECT '\n=== ADDRESSES TABLE ===' AS '';
DESCRIBE addresses;

SELECT '\n=== SCHOOLS TABLE ===' AS '';
DESCRIBE schools;

SELECT '\n=== PARENTS TABLE ===' AS '';
DESCRIBE parents;

SELECT '\n=== COURSES TABLE ===' AS '';
DESCRIBE courses;

-- Check if courses are populated
SELECT '\n=== AVAILABLE COURSES ===' AS '';
SELECT id, name FROM courses ORDER BY id;

-- Check if roles are populated
SELECT '\n=== AVAILABLE ROLES ===' AS '';
SELECT id, name, description FROM roles ORDER BY id;

-- Check if user types are populated
SELECT '\n=== USER TYPES ===' AS '';
SELECT id, type_name, description FROM user_types ORDER BY id;

-- Check if identity types are populated
SELECT '\n=== IDENTITY TYPES ===' AS '';
SELECT id, type_name, description FROM identity_types ORDER BY id;

-- Count records in each table
SELECT '\n=== RECORD COUNTS ===' AS '';
SELECT
    'users' AS table_name, COUNT(*) AS record_count FROM users
UNION ALL SELECT 'contacts', COUNT(*) FROM contacts
UNION ALL SELECT 'addresses', COUNT(*) FROM addresses
UNION ALL SELECT 'schools', COUNT(*) FROM schools
UNION ALL SELECT 'parents', COUNT(*) FROM parents
UNION ALL SELECT 'courses', COUNT(*) FROM courses
UNION ALL SELECT 'roles', COUNT(*) FROM roles
UNION ALL SELECT 'user_types', COUNT(*) FROM user_types
UNION ALL SELECT 'identity_types', COUNT(*) FROM identity_types
UNION ALL SELECT 'address_types', COUNT(*) FROM address_types;

-- Check foreign keys
SELECT '\n=== FOREIGN KEY CONSTRAINTS ===' AS '';
SELECT
    CONSTRAINT_NAME,
    TABLE_NAME,
    REFERENCED_TABLE_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE CONSTRAINT_SCHEMA = 'kzn-matric'
  AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME, CONSTRAINT_NAME;

-- Check indexes
SELECT '\n=== INDEXES ===' AS '';
SELECT
    TABLE_NAME,
    INDEX_NAME,
    COLUMN_NAME
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'kzn-matric'
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;

SELECT '\n✅ Database verification complete!' AS '';
