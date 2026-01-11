# Gmail App Password Setup - Step by Step

## Why You Need This

Gmail no longer allows regular passwords for SMTP access. You **must** use an App Password.

## Current Status

❌ Your current setup is using a regular password: `matricexcellence@2026!`
✅ You need to replace it with a 16-character App Password

---

## Step-by-Step Setup

### Step 1: Enable 2-Step Verification

1. **Go to Google Account Security**
   - Click here: https://myaccount.google.com/security
   - Or manually: Google Account → Security

2. **Find "2-Step Verification"**
   - Scroll down to "How you sign in to Google"
   - Click on "2-Step Verification"

3. **Turn it ON**
   - Click "Get Started"
   - Follow the prompts (you'll need your phone)
   - Verify your phone number
   - Complete the setup

### Step 2: Create App Password

1. **Go to App Passwords**
   - Direct link: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → 2-Step Verification → App passwords (at the bottom)

2. **Create New App Password**
   - Select app: Choose **"Mail"**
   - Select device: Choose **"Other (Custom name)"**
   - Enter name: Type **"KZN Matric Excellence"**
   - Click **"Generate"**

3. **Copy the Password**
   - Google will show a 16-character password
   - It looks like: `abcd efgh ijkl mnop`
   - **COPY THIS PASSWORD** (you won't see it again!)

### Step 3: Update .env.local

1. **Open your .env.local file**

2. **Replace SMTP_PASS**

   From:
   ```bash
   SMTP_PASS=matricexcellence@2026!
   ```

   To:
   ```bash
   SMTP_PASS=abcd efgh ijkl mnop  # Your actual 16-character app password
   ```

   ⚠️ **Important:** Replace `abcd efgh ijkl mnop` with YOUR actual app password!

3. **Save the file**

### Step 4: Test the Setup

1. **Run the test script**
   ```bash
   node test-smtp.js
   ```

2. **Expected output:**
   ```
   ✅ SMTP connection successful!
   ✅ Test email sent successfully!
   🎉 SMTP is configured correctly!
   ```

3. **Check your email**
   - Go to: matricexcellence90@gmail.com
   - Look for "Test Email from KZN Matric Excellence"
   - If you see it, your setup is working! ✅

---

## Complete Example

Your final `.env.local` should look like this:

```bash
# ===================================
# SMTP EMAIL CONFIGURATION
# ===================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=matricexcellence90@gmail.com
SMTP_PASS=abcd efgh ijkl mnop  # ← Replace with YOUR app password
```

---

## Troubleshooting

### "I don't see App Passwords option"
**Cause:** 2-Step Verification is not enabled

**Solution:**
1. Enable 2-Step Verification first (Step 1 above)
2. Wait a few minutes
3. Go back to https://myaccount.google.com/apppasswords

### "Invalid credentials" error persists
**Solutions:**
1. Make sure you copied the ENTIRE 16-character password (with spaces)
2. Try removing spaces: `abcdefghijklmnop` (all together)
3. Restart your dev server: `npm run dev`
4. Try generating a new app password

### "2-Step Verification required"
**Solution:**
- You must enable 2-Step Verification (it's a Gmail requirement)
- No way around this for SMTP access

---

## Alternative: Use a Different Gmail Account

If you don't want to enable 2-Step on your main account:

1. **Create a new Gmail account**
   - Go to: https://accounts.google.com/signup
   - Example: `kznmatric.noreply@gmail.com`

2. **Enable 2-Step Verification** on the new account

3. **Generate App Password** for the new account

4. **Update .env.local** with new credentials
   ```bash
   SMTP_USER=kznmatric.noreply@gmail.com
   SMTP_PASS=your-app-password-here
   ```

---

## After Setup

Once you have your App Password working:

1. ✅ Test with: `node test-smtp.js`
2. ✅ Restart dev server: `npm run dev`
3. ✅ Test registration: http://localhost:3000/signup
4. ✅ Check emails are sent successfully

---

## Security Notes

⚠️ **Never commit .env.local to Git!**
- It's already in `.gitignore`
- App passwords give full access to your Gmail
- Keep them secret!

✅ **App Password is safer than regular password**
- Can be revoked at any time
- Doesn't expose your main password
- Can create multiple for different apps

---

## Need Help?

Run the test script to see detailed error messages:
```bash
node test-smtp.js
```

The script will tell you exactly what's wrong and how to fix it.
