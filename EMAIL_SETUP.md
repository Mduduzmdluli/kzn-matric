# Email Notification Setup Guide

## Overview

After successful student registration, the system will automatically send:

1. **Welcome Email** to the student
2. **Admin Notification** to admin@matricexcellence.co.za with student details and document links

## Email Features

### Student Welcome Email
- Professional branded email
- Confirmation of successful registration
- What happens next
- Login link
- Contact information

### Admin Notification Email
Subject: `Online - [Student Name] - [ID Number]`

Contains:
- Complete student information
- School details
- Selected courses
- Parent/guardian information
- **Links to uploaded documents** (ID and Matric certificate)

## SMTP Configuration

### Option 1: Using Gmail (Recommended for Testing)

1. **Enable 2-Step Verification**
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Create App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Click "Generate"
   - Copy the 16-character password

3. **Update .env.local**
   ```bash
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx  # The app password from step 2
   ```

### Option 2: Using Afrihost Email (Recommended for Production)

Contact Afrihost support to get:
- SMTP server address (usually `mail.matricexcellence.co.za`)
- SMTP port (usually 587 or 465)
- Email account credentials

Update `.env.local`:
```bash
SMTP_HOST=mail.matricexcellence.co.za
SMTP_PORT=587
SMTP_USER=noreply@matricexcellence.co.za
SMTP_PASS=your-email-password
```

### Option 3: Using Other SMTP Services

Popular alternatives:
- **SendGrid**: Free tier (100 emails/day)
- **Mailgun**: Free tier (5,000 emails/month)
- **Amazon SES**: Very cheap, requires AWS account

## Testing Email Functionality

### 1. Start Development Server
```bash
npm run dev
```

### 2. Register a Test Student
- Go to: http://localhost:3000/signup
- Complete the registration form
- Use your own email for testing

### 3. Check Email Delivery

**Student Email:**
- Check inbox of the email you registered with
- Should receive "Welcome to KZN Matric Excellence!" email

**Admin Email:**
- Check: admin@matricexcellence.co.za
- Subject: "Online - [Student Name] - [ID Number]"
- Contains student details and document links

### 4. Check Server Logs

Look for these messages:
```
✅ Registration emails sent successfully
```

Or if there are errors:
```
❌ Some emails failed to send: [error details]
```

## Troubleshooting

### Gmail: "Less secure app access"
**Solution:** Use App Password instead of regular password (see Option 1 above)

### "ECONNREFUSED" or "Connection timeout"
**Causes:**
- Wrong SMTP host or port
- Firewall blocking SMTP
- SMTP credentials incorrect

**Solution:**
```bash
# Test SMTP connection
telnet smtp.gmail.com 587
```

### Emails not sending
1. Check `.env.local` has correct SMTP settings
2. Restart development server after changing `.env.local`
3. Check console for error messages
4. Verify email credentials are correct

### "Invalid login" error
**Causes:**
- Wrong username/password
- 2-Step Verification not enabled (for Gmail)
- Not using App Password (for Gmail)

**Solution:**
- For Gmail: Use App Password, not regular password
- For other providers: Check credentials in hosting control panel

### Emails go to spam
**Solutions:**
1. Add `noreply@matricexcellence.co.za` to safe senders
2. For production, configure SPF and DKIM records in DNS
3. Use a domain email instead of Gmail

## Production Deployment

### Environment Variables

When deploying to production (Vercel, Netlify, etc.), set these environment variables:

```
SMTP_HOST=mail.matricexcellence.co.za
SMTP_PORT=587
SMTP_USER=noreply@matricexcellence.co.za
SMTP_PASS=your-production-password
NEXT_PUBLIC_API_URL=https://online.matricexcellence.co.za/api
```

### Email Best Practices

1. **Use a dedicated email** (e.g., `noreply@matricexcellence.co.za`)
2. **Configure DNS records** (SPF, DKIM, DMARC)
3. **Monitor email delivery** rates
4. **Keep email content professional** and brief
5. **Include unsubscribe link** (for marketing emails)

## Email Templates

The system includes two email templates:

### 1. Student Welcome Email
- Location: `src/app/api/emails/send-welcome/route.ts`
- Customizable: Yes, edit the HTML template
- Features: Responsive design, branded colors

### 2. Admin Notification Email
- Location: `src/app/api/emails/send-admin-notification/route.ts`
- Subject Format: `Online - [Name] - [ID Number]`
- Includes: All student data, document links

## Customization

### Change Email Content

Edit the respective route files:
- `src/app/api/emails/send-welcome/route.ts` - Student email
- `src/app/api/emails/send-admin-notification/route.ts` - Admin email

### Change "From" Name

In both email routes, update:
```javascript
from: `"KZN Matric Excellence" <${process.env.SMTP_USER}>`,
```

### Add CC or BCC

```javascript
mailOptions = {
  ...
  cc: 'manager@matricexcellence.co.za',
  bcc: 'backup@matricexcellence.co.za',
}
```

## Email Flow

```
Student Registration
        |
        v
Database Save (Transaction)
        |
        v
Transaction Commit ✅
        |
        v
    [Emails sent in background - non-blocking]
        |
        +-- Welcome Email → Student
        |
        +-- Notification Email → admin@matricexcellence.co.za
```

**Important:** Emails are sent **after** successful database save, so registration succeeds even if emails fail.

## Support

If you need help:
1. Check server console for error messages
2. Verify SMTP credentials
3. Test with Gmail first (easier setup)
4. Contact your email provider for SMTP details
