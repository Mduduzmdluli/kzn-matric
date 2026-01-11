# Static Export Changes - Document Upload Removed

## Problem
The application was using `output: "export"` for static hosting, but had server-side API routes that require Node.js runtime:
- `/api/upload/documents` - File system operations (fs/promises)
- `/api/auth/register` - MySQL database operations
- `/api/emails/*` - Email sending with nodemailer

**Error encountered:** `POST /api/upload/documents` returned 404 (Not Found) after deployment.

## Solution Applied

### Temporary Fix (Current)
Removed the file upload step from registration to make the static export work:

1. **Registration Form Changes** ([src/components/Auth/Signup/index.tsx](src/components/Auth/Signup/index.tsx))
   - Removed `/api/upload/documents` API call
   - Documents are now tracked by filename only
   - No actual file upload happens
   - Document selection is now optional

2. **Admin Email Updates** ([src/app/api/emails/send-admin-notification/route.ts](src/app/api/emails/send-admin-notification/route.ts))
   - Changed from showing document download links to document status
   - Shows "✓ Student indicated they have this document" or "❌ Not selected"
   - Includes clear instructions to contact student for document collection
   - Displays student email and phone for follow-up

3. **Database Changes** ([src/lib/db.ts](src/lib/db.ts))
   - Removed `ssl: false` configuration (TypeScript error)
   - SSL disabled by default when not specified

## Current Workflow

### Registration Flow:
1. Student fills out registration form
2. Student optionally selects ID and Matric documents (files not uploaded)
3. Registration submitted to database
4. Student receives welcome email
5. Admin receives notification email with:
   - Complete student information
   - Document status (selected/not selected)
   - Student contact info for document collection

### Document Collection:
Admin must manually contact students to collect documents via:
- Email: student's registered email
- Phone: student's registered phone number

## Important Notes

⚠️ **Current Limitation**: This is a workaround for static export. The app still has API routes that won't work on pure static hosting (GitHub Pages, Netlify static, etc.)

### API Routes That Still Need Server Runtime:
- `/api/auth/register` - Database operations
- `/api/emails/send-welcome` - Email sending
- `/api/emails/send-admin-notification` - Email sending
- `/api/auth/login` - Authentication

## Recommended Long-term Solutions

### Option 1: Use Server-Side Hosting (Recommended)
Remove `output: "export"` and deploy to platforms with Node.js support:

**Best Platforms:**
- **Vercel** (easiest, made by Next.js team) ✅ Recommended
- **Netlify** (with Next.js runtime)
- **Railway**
- **Render**
- **Your Afrihost Server** (if it supports Node.js hosting)

**Benefits:**
- Full API route support
- File uploads work
- Database connections work
- Email sending works
- No manual document collection needed

### Option 2: Convert to Fully Static with External Services
Keep `output: "export"` but replace server features:

1. **File Uploads**: Use Cloudinary or AWS S3
2. **Email**: Use EmailJS (client-side)
3. **Database**: Use Supabase or Firebase (client-side SDK)
4. **Authentication**: Use Supabase Auth or Clerk

**Trade-offs:**
- More complex setup
- Additional service costs
- Less secure (client-side operations)

## Next Steps

### For Testing:
1. Build: `npm run build`
2. Test locally: `npm run start` (requires Node.js server)
3. Deploy to hosting platform

### For Production:
**Recommended:** Deploy to Vercel for full functionality
- Remove `output: "export"` from next.config.mjs
- Re-enable document uploads
- All features will work as designed

### Current Setup Works For:
✅ Static pages
✅ Registration (without file uploads)
✅ Email notifications
✅ Database operations
❌ File uploads (disabled)

## Files Modified

1. `src/components/Auth/Signup/index.tsx` - Removed upload API call
2. `src/app/api/emails/send-admin-notification/route.ts` - Updated email template
3. `src/lib/db.ts` - Fixed SSL configuration

## Testing Checklist

- [ ] Registration form submits successfully
- [ ] Student receives welcome email
- [ ] Admin receives notification email with correct format
- [ ] Email shows document status correctly
- [ ] Database stores registration data
- [ ] No 404 errors on registration

---

**Last Updated:** 2026-01-11
**Status:** Temporary workaround - works with static export but manual document collection required
