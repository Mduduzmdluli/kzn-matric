# EmailJS Setup Guide

This guide will help you set up EmailJS to send emails from the contact form to support@knmatricexcellence.co.za

## Step 1: Create an EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Add Email Service

1. In the EmailJS dashboard, click on "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Connect your email account that will send the emails
5. Copy the **Service ID** (you'll need this later)

## Step 3: Create Email Template

1. In the EmailJS dashboard, click on "Email Templates"
2. Click "Create New Template"
3. Use the following template structure:

**Subject:**
```
New Contact Form Message: {{subject}}
```

**Content:**
```
You have received a new message from the contact form:

Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}
Subject: {{subject}}

Message:
{{message}}

---
This email was sent from the KN Matric Excellence contact form.
```

4. Set the "To email" field to: `support@knmatricexcellence.co.za`
5. Save the template and copy the **Template ID**

## Step 4: Get Your Public Key

1. Go to "Account" in the EmailJS dashboard
2. Find your **Public Key** (also called API Key)
3. Copy this key

## Step 5: Configure Environment Variables

1. Create a file named `.env.local` in the root of your project
2. Add the following content (replace with your actual values):

```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
```

3. Save the file

## Step 6: Test the Contact Form

1. Run your development server: `npm run dev`
2. Go to the contact page
3. Fill out and submit the form
4. Check if the email arrives at support@knmatricexcellence.co.za

## Important Notes

- The free tier of EmailJS allows 200 emails per month
- Make sure `.env.local` is in your `.gitignore` (it already is)
- For production deployment, add these environment variables to your hosting platform (Vercel, Netlify, etc.)

## Template Variables Used

The following variables are sent from the contact form:
- `from_name` - Sender's full name
- `from_email` - Sender's email address
- `phone` - Sender's phone number
- `subject` - Selected subject from dropdown
- `message` - The message content
- `to_email` - Recipient email (support@knmatricexcellence.co.za)

## Troubleshooting

If emails aren't sending:
1. Check that all environment variables are set correctly
2. Verify your EmailJS service is connected and active
3. Check the browser console for error messages
4. Ensure your EmailJS account is verified
5. Check your email service connection status in EmailJS dashboard
