# Whitelist Your IP Address in Afrihost

## 🚨 Current Issue

Your connection is being blocked because your IP address is not whitelisted.

**Your current IP:** `vc-gp-n-105-243-30-132.umts.vodacom.co.za`

This is a Vodacom mobile network IP, which means you're connecting via mobile data.

## ✅ Solution: Whitelist Your IP

### Step 1: Get Your Current IP Address

```bash
curl ifconfig.me
```

This will show something like: `105.243.30.132`

### Step 2: Add IP to Afrihost Remote MySQL

1. **Log into Afrihost cPanel**
   - Go to: https://www.matricexcellence.co.za/cpanel
   - Or: https://cpanel.matricexcellence.co.za

2. **Find Remote MySQL**
   - Look for "Databases" section
   - Click on **"Remote MySQL"**

3. **Add Your IP**
   - In the "Host" field, enter the IP you got from Step 1
   - Or enter: `%` to allow ALL IPs (less secure, but easier for testing)
   - Click **"Add Host"**

### Step 3: Verify User Privileges

In cPanel:
1. Go to **"MySQL Databases"**
2. Scroll to **"Add User To Database"**
3. Make sure `matricu2f0z0_admin` is added to `matricu2f0z0_kzn-matric`
4. Click **"Make Changes"** if needed
5. Ensure **ALL PRIVILEGES** are checked

### Step 4: Test Again

```bash
node test-db-connection.js
```

## 📱 Mobile Network Note

You're connecting from a Vodacom mobile network. Mobile IPs often change, so:

**Option A:** Use WiFi instead (more stable IP)

**Option B:** Whitelist wildcard for Vodacom
- In Remote MySQL, add: `%.vodacom.co.za`
- This allows all Vodacom IPs

**Option C:** Use `%` (Allow all IPs)
- ⚠️ Less secure but works for development
- In Remote MySQL, add: `%`
- Change this to specific IP in production

## 🔐 Alternative: Reset Password

If whitelisting doesn't work, try resetting the password:

1. In cPanel → **MySQL Databases**
2. Find user `matricu2f0z0_admin`
3. Click **"Change Password"**
4. Set a new password (write it down!)
5. Update `.env.local` with new password
6. Test again

## ✅ Expected Success

After whitelisting, you should see:

```
✅ Connected to database successfully!
📊 Current Database: matricu2f0z0_kzn-matric
📋 Tables found: 0 (or more if tables exist)
```

## 🆘 Still Not Working?

### Check These:

1. **Username is correct**
   - Should be: `matricu2f0z0_admin`
   - Sometimes needs to match exactly (case-sensitive)

2. **Password is correct**
   - Try resetting it in cPanel
   - Check for special characters that might need escaping

3. **Database exists**
   - Verify in cPanel → MySQL Databases
   - Should see: `matricu2f0z0_kzn-matric`

4. **User has access to database**
   - In MySQL Databases, check "Current Databases"
   - Next to your database, you should see the user listed

## 📞 Contact Support

If still having issues:
- Afrihost Support: support@afrihost.com
- Phone: 087 470 0000
- Ask them to verify Remote MySQL is enabled for your account
