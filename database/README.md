# Database Setup Guide for KZN Matric Excellence

This directory contains database schema and migration scripts for the KZN Matric Excellence platform.

## Quick Start - Recreate Lost Database

If you've lost your database, follow these steps to recreate it from your registration form:

### Step 1: Start MySQL Server

**Option A: Using Command Line (as Administrator)**
```bash
net start mysql80
```

**Option B: Using Services**
1. Press `Win + R`, type `services.msc`
2. Find "MySQL80" service
3. Right-click → Start

### Step 2: Run the Complete Schema

```bash
mysql -u root -p < database/schema/complete_database_schema.sql
```

Or using MySQL Workbench:
1. Open MySQL Workbench
2. Connect to your server (localhost, user: root)
3. File → Open SQL Script
4. Select `database/schema/complete_database_schema.sql`
5. Execute (⚡ icon or Ctrl+Shift+Enter)

### Step 3: Verify Setup

```bash
mysql -u root -p
```

Then:
```sql
USE `kzn-matric`;
SHOW TABLES;
-- Should show 14 tables
```

## What's Included in the Schema

The complete schema creates:
- ✅ All 14 tables needed for registration
- ✅ 13 pre-configured courses (Math, Science, English, etc.)
- ✅ User roles (Admin, Student, Teacher)
- ✅ All foreign key relationships
- ✅ Indexes for performance
- ✅ A student profile view

## Running Migrations

### Option 1: Using MySQL Command Line

```bash
# Connect to your database
mysql -u root -p kzn-matric

# Run the migration
source migrations/add_document_fields.sql

# Or, run directly from command line
mysql -u root -p kzn-matric < migrations/add_document_fields.sql
```

### Option 2: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your database
3. Open the migration file: `migrations/add_document_fields.sql`
4. Click "Execute" (⚡ icon)

### Option 3: Using phpMyAdmin

1. Open phpMyAdmin
2. Select the `kzn-matric` database
3. Go to the "SQL" tab
4. Copy and paste the contents of `migrations/add_document_fields.sql`
5. Click "Go"

## Migrations List

### add_document_fields.sql
**Date:** 2026-01-05
**Description:** Adds document URL fields to users table for storing ID copy and matric certificate paths.

**Changes:**
- Adds `id_document_url` column to `users` table
- Adds `matric_document_url` column to `users` table
- Creates index on document fields

**Tables affected:**
- `users`

## Verifying Migration

After running the migration, verify it was successful:

```sql
-- Check if columns exist
DESCRIBE users;

-- Check if index was created
SHOW INDEX FROM users WHERE Key_name = 'idx_users_documents';

-- Test query
SELECT id, first_name, last_name, id_document_url, matric_document_url
FROM users
LIMIT 5;
```

Expected output should show the two new columns:
- `id_document_url` varchar(500) NULL
- `matric_document_url` varchar(500) NULL

## Rollback (If Needed)

If you need to rollback this migration:

```sql
-- Remove the columns
ALTER TABLE users
DROP COLUMN IF EXISTS id_document_url,
DROP COLUMN IF EXISTS matric_document_url;

-- Remove the index
DROP INDEX IF EXISTS idx_users_documents ON users;
```

## Best Practices

1. **Backup First:** Always backup your database before running migrations
   ```bash
   mysqldump -u root -p kzn-matric > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **Test in Development:** Run migrations in a development environment first

3. **Review Changes:** Read through the SQL before executing

4. **Document Results:** Keep track of which migrations have been run

## Troubleshooting

### Column Already Exists
If you see an error like "Duplicate column name", the migration has already been run. The migration uses `IF NOT EXISTS` to prevent errors, but if it still occurs, verify the columns exist:

```sql
SHOW COLUMNS FROM users LIKE '%document%';
```

### Permission Denied
Ensure your database user has ALTER TABLE privileges:

```sql
GRANT ALTER ON kzn_matric.* TO 'your_user'@'localhost';
FLUSH PRIVILEGES;
```

### Connection Issues
Check your database connection settings in [.env](.env) or [src/lib/db.ts](../src/lib/db.ts).
