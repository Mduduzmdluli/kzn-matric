# Document Attachments Feature

## ✅ What Was Implemented

The admin notification email now **includes actual document attachments** instead of just showing document status.

## How It Works

### 1. Student Registration Flow

**Step 1: Document Selection**
- Student selects ID document (PDF, JPG, or PNG)
- Student selects Matric certificate (PDF, JPG, or PNG)
- Documents can be optional

**Step 2: File Conversion (Browser)**
- Files converted to base64 format using FileReader API
- No upload to server - happens entirely in browser
- Document data includes:
  - `name`: Original filename
  - `type`: MIME type (image/jpeg, application/pdf, etc.)
  - `data`: Base64 encoded file content

**Step 3: Registration Submission**
- Document data sent with registration payload
- Stored in database as filename only
- Full document data passed to email notification

### 2. Admin Email Notification

**Email Includes:**
- Complete student information
- School and course details
- Parent/guardian information
- **Document attachments** (actual files)

**Attachment Format:**
```
From: KZN Matric Excellence Registration
To: admin@matricexcellence.co.za
Subject: Online - [FirstName] [LastName] - [ID Number]

Attachments:
  📎 John_Doe_ID_1234567890123.pdf (ID Document)
  📎 John_Doe_MATRIC_1234567890123.jpg (Matric Certificate)
```

**Email Body Shows:**
- ✓ ID Document: filename.pdf (attached)
- ✓ Matric Certificate: filename.jpg (attached)

**If Documents Missing:**
- ❌ Not provided
- Shows contact info to request from student

## Benefits

### ✅ No Server File Storage Needed
- Works with static export
- No file system operations
- Compatible with any hosting platform

### ✅ Immediate Document Delivery
- Admin receives documents instantly
- Can download and save from email
- No manual follow-up if documents provided

### ✅ Secure Transfer
- Documents sent via encrypted SMTP
- Only admin email receives attachments
- Not stored on public server

### ✅ File Size Considerations
- Browser converts to base64 (~33% larger)
- Email attachment limits apply (typically 25MB)
- Current form limits: 5MB per document
- Base64 encoded: ~6.7MB per document
- Total payload: ~13.4MB (well under email limits)

## Technical Implementation

### Frontend ([src/components/Auth/Signup/index.tsx](src/components/Auth/Signup/index.tsx))

```typescript
// Convert file to base64
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Prepare document data
if (formData.idDocument) {
  idDocumentData = {
    name: formData.idDocument.name,
    type: formData.idDocument.type,
    data: await convertToBase64(formData.idDocument)
  };
}
```

### Backend ([src/app/api/emails/send-admin-notification/route.ts](src/app/api/emails/send-admin-notification/route.ts))

```typescript
// Prepare attachments
const attachments = [];
if (documents.idDocument) {
  const base64Data = documents.idDocument.data.split(',')[1];
  attachments.push({
    filename: documents.idDocument.name,
    content: base64Data,
    encoding: 'base64',
    contentType: documents.idDocument.type
  });
}

// Send email with attachments
const mailOptions = {
  from: `"KZN Matric Excellence" <${process.env.SMTP_USER}>`,
  to: 'admin@matricexcellence.co.za',
  subject: subject,
  attachments: attachments, // ← Documents attached here
  html: emailTemplate
};
```

## Database Storage

Documents are stored in the `users` table:
- `id_document_url`: Filename only (e.g., "John_Doe_ID.pdf")
- `matric_document_url`: Filename only (e.g., "John_Doe_MATRIC.jpg")

**Note:** Only filenames stored in DB, not actual files. Full documents sent via email only.

## Testing

### Test Registration with Documents:
1. Fill out registration form
2. Select ID document (PDF/JPG/PNG)
3. Select Matric certificate (PDF/JPG/PNG)
4. Submit registration
5. Check admin email inbox

### Expected Results:
✅ Registration successful
✅ Student receives welcome email
✅ Admin receives notification email
✅ Email has 2 attachments
✅ Attachments can be downloaded and opened
✅ Filenames match selected files

## Limitations & Notes

### File Size Limits:
- Form validation: 5MB per document
- Base64 encoding adds ~33% overhead
- Email servers typically limit 25-50MB total
- Current setup: ~13.4MB max (safe for all email providers)

### Supported File Types:
- PDF: `application/pdf`
- JPEG: `image/jpeg`, `image/jpg`
- PNG: `image/png`

### Email Requirements:
⚠️ **Gmail App Password Required**
- Must enable 2-Step Verification
- Must generate App Password
- See [GMAIL_APP_PASSWORD_SETUP.md](GMAIL_APP_PASSWORD_SETUP.md)

### Network Considerations:
- Large files take longer to upload
- Base64 encoding happens in browser
- No progress indicator (could add later)

## Troubleshooting

### Documents Not Attached to Email

**Check:**
1. Student selected documents during registration?
2. SMTP credentials configured correctly?
3. Email actually sent? (check console logs)

**Console Logs:**
```
✅ Registration emails sent successfully
// or
❌ Some emails failed to send: [error details]
```

### Email Rejected Due to Size

**Solution:**
- Reduce file size limit in form validation
- Compress images before upload
- Use PDF compression for large documents

### Documents Corrupted/Can't Open

**Check:**
- Base64 encoding/decoding correct
- MIME type matches actual file type
- No truncation in database/email

## Future Enhancements

### Possible Improvements:
1. **Progress Indicator**: Show upload progress for large files
2. **Image Compression**: Auto-compress images before encoding
3. **PDF Optimization**: Reduce PDF file sizes
4. **Cloud Storage**: Upload to Cloudinary and send links instead
5. **Admin Dashboard**: View/download documents from web interface

## Files Modified

1. **[src/components/Auth/Signup/index.tsx](src/components/Auth/Signup/index.tsx)**
   - Added base64 conversion function
   - Modified payload to include document data

2. **[src/app/api/auth/register/route.ts](src/app/api/auth/register/route.ts)**
   - Updated to receive document objects
   - Passes document data to email notification

3. **[src/app/api/emails/send-admin-notification/route.ts](src/app/api/emails/send-admin-notification/route.ts)**
   - Added attachment preparation
   - Updated email template to show attachment status
   - Sends documents as proper email attachments

---

**Status:** ✅ Fully Implemented and Working
**Last Updated:** 2026-01-11
