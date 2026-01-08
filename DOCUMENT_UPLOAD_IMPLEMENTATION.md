# Document Upload Implementation

## Overview
This implementation adds document upload functionality to the student registration form, allowing students to upload their ID copy and matric certificate during signup.

## Changes Made

### 1. SignUp Component Updates
**File:** [src/components/Auth/SignUp/index.tsx](src/components/Auth/SignUp/index.tsx)

- Added two new file upload fields in Step 4:
  - `idDocument` - For ID copy upload
  - `matricDocument` - For matric results/certificate upload
- Removed single `document` field
- Updated `handleFileChange` function to:
  - Accept field name parameter to handle both documents separately
  - Validate file size (max 5MB)
  - Validate file type (PDF, JPG, PNG only)
- Updated `handleSubmit` to:
  - Validate that both documents are uploaded before submission
  - Upload documents to `/api/upload/documents` endpoint first
  - Send document URLs to registration API
- Modified Step 4 UI to show two separate upload areas with clear labels

### 2. File Upload API Endpoint
**File:** [src/app/api/upload/documents/route.ts](src/app/api/upload/documents/route.ts)

Created new API endpoint that:
- Accepts FormData with both documents
- Validates file types (PDF, JPG, PNG)
- Validates file sizes (max 5MB each)
- Creates upload directory at `public/uploads/documents/`
- Generates unique filenames with format: `{StudentName}_{IDNumber}_{DocumentType}_{Timestamp}.{ext}`
- Saves files to disk
- Returns URLs in format: `/uploads/documents/{filename}`

### 3. Database Schema Updates
**File:** [database/migrations/add_document_fields.sql](database/migrations/add_document_fields.sql)

SQL migration to add two new columns to `users` table:
- `id_document_url` VARCHAR(500) - Stores path to ID document
- `matric_document_url` VARCHAR(500) - Stores path to matric certificate
- Added index for performance optimization
- Fields are nullable for backward compatibility

### 4. Registration API Updates
**File:** [src/app/api/auth/register/route.ts](src/app/api/auth/register/route.ts)

- Added `documents` parameter extraction
- Updated INSERT query to include document URL fields
- Saves document URLs to database during registration

## File Storage Structure

```
public/
└── uploads/
    └── documents/
        ├── John_Doe_9501015800080_ID_1704449123456.pdf
        ├── John_Doe_9501015800080_MATRIC_1704449123456.jpg
        └── ...
```

## Database Schema

```sql
ALTER TABLE users
ADD COLUMN id_document_url VARCHAR(500) NULL,
ADD COLUMN matric_document_url VARCHAR(500) NULL;
```

## Next Steps - IMPORTANT!

### 1. Run Database Migration
Execute the SQL migration to add the new columns:

```bash
# Connect to your MySQL database
mysql -u root -p kzn-matric

# Run the migration
source database/migrations/add_document_fields.sql
```

Or manually run:
```sql
ALTER TABLE users
ADD COLUMN IF NOT EXISTS id_document_url VARCHAR(500) NULL COMMENT 'URL path to uploaded ID document',
ADD COLUMN IF NOT EXISTS matric_document_url VARCHAR(500) NULL COMMENT 'URL path to uploaded matric certificate/results';

CREATE INDEX IF NOT EXISTS idx_users_documents ON users(id_document_url, matric_document_url);
```

### 2. Create Upload Directory
Ensure the upload directory exists:

```bash
mkdir -p public/uploads/documents
```

### 3. Configure Permissions (Production)
Set appropriate permissions for the upload directory:

```bash
chmod 755 public/uploads/documents
```

### 4. Configure Next.js for Static Export
Since the project uses static export (`output: "export"`), you may need to adjust the file upload strategy for production deployment on GitHub Pages.

**Important Note:** File uploads typically require a server. For GitHub Pages deployment, consider:

#### Option A: Use External Storage Service
- AWS S3
- Cloudinary
- Firebase Storage
- Other cloud storage providers

#### Option B: Use a Serverless Function
- Vercel Serverless Functions
- Netlify Functions
- AWS Lambda

#### Option C: Switch Deployment Platform
Deploy to a platform that supports server-side functionality:
- Vercel
- Netlify
- Railway
- Render

### 5. Update `.gitignore`
Add the uploads directory to `.gitignore` to prevent uploaded files from being committed:

```
# Uploaded documents
public/uploads/documents/*
!public/uploads/documents/.gitkeep
```

Then create a `.gitkeep` file:
```bash
touch public/uploads/documents/.gitkeep
```

## Security Considerations

### Implemented
- File type validation (PDF, JPG, PNG only)
- File size limits (5MB max per file)
- Unique filename generation to prevent overwrites
- Sanitized filenames to prevent path traversal

### Recommended Additional Security
1. **Virus Scanning**: Implement virus scanning for uploaded files
2. **Content Type Verification**: Verify actual file content matches extension
3. **Access Control**: Implement authentication checks before allowing downloads
4. **Storage Encryption**: Encrypt files at rest (especially for sensitive documents like IDs)
5. **HTTPS Only**: Ensure all uploads happen over HTTPS
6. **Rate Limiting**: Implement rate limiting on upload endpoint
7. **File Retention Policy**: Define how long to keep documents

## Testing

### Test the Upload Flow
1. Navigate to signup page
2. Fill out all steps
3. In Step 4, upload:
   - A PDF/JPG/PNG file as ID copy (under 5MB)
   - A PDF/JPG/PNG file as matric certificate (under 5MB)
4. Complete registration
5. Verify:
   - Files are saved in `public/uploads/documents/`
   - Database record has correct URLs in `id_document_url` and `matric_document_url` columns

### Test Validation
- Try uploading files over 5MB (should show error)
- Try uploading invalid file types (should show error)
- Try submitting without documents (should show error)

## API Endpoints

### POST /api/upload/documents
Upload both ID and matric documents.

**Request (FormData):**
```
idDocument: File
matricDocument: File
studentName: string
idNumber: string
```

**Response:**
```json
{
  "success": true,
  "message": "Documents uploaded successfully",
  "idDocumentUrl": "/uploads/documents/John_Doe_9501015800080_ID_1704449123456.pdf",
  "matricDocumentUrl": "/uploads/documents/John_Doe_9501015800080_MATRIC_1704449123456.jpg"
}
```

### POST /api/auth/register
Existing endpoint updated to accept document URLs.

**Additional Request Fields:**
```json
{
  "documents": {
    "id_document_url": "/uploads/documents/...",
    "matric_document_url": "/uploads/documents/..."
  }
}
```

## File Naming Convention

Format: `{StudentName}_{IDNumber}_{DocumentType}_{Timestamp}.{extension}`

Example:
- `John_Doe_9501015800080_ID_1704449123456.pdf`
- `Jane_Smith_9601025800082_MATRIC_1704449123789.jpg`

This ensures:
- Files are easily identifiable
- No naming conflicts
- Easy to search/filter by student
- Maintains audit trail with timestamp

## Support

For issues or questions, please check:
1. File permissions on upload directory
2. Database migration was run successfully
3. File size and type restrictions
4. Server logs for detailed error messages
