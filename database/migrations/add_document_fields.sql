-- Migration: Add document URL fields to users table
-- Date: 2026-01-05
-- Description: Add columns to store ID copy and matric certificate document URLs

-- Add document URL columns to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS id_document_url VARCHAR(500) NULL COMMENT 'URL path to uploaded ID document',
ADD COLUMN IF NOT EXISTS matric_document_url VARCHAR(500) NULL COMMENT 'URL path to uploaded matric certificate/results';

-- Add index for faster queries if needed
CREATE INDEX IF NOT EXISTS idx_users_documents ON users(id_document_url, matric_document_url);

-- Note: These fields are nullable to maintain backward compatibility with existing records
-- New registrations will require these documents as per the updated signup form
