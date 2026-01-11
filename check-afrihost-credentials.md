# How to Get Correct Afrihost MySQL Credentials

## The Problem

You're getting "Access denied" error because one of these is incorrect:
- Username
- Password
- Database name
- Or your IP is not whitelisted

## Step-by-Step Fix

### 1. Log into Afrihost cPanel

Go to: https://www.matricexcellence.co.za/cpanel (or your cPanel URL)

### 2. Check Database Name

1. In cPanel, find **"Databases"** section
2. Click **"MySQL Databases"**
3. Look for **"Current Databases"** section
4. You should see databases like:
   - `matricu2f0z0_database1`
   - `matricu2f0z0_kznmatric`
   - etc.

**Copy the exact database name** - it's usually `yourprefix_databasename`

### 3. Check Username

In the same **MySQL Databases** page:
1. Look for **"Current Users"** section
2. Find your username - should be like `matricu2f0z0_admin`
3. Note: cPanel prefixes usernames automatically

### 4. Verify/Reset Password

If you're not sure about the password:
1. In **"Current Users"** section
2. Find your user (`matricu2f0z0_admin`)
3. Click **"Change Password"**
4. Set a new password (write it down!)

### 5. Whitelist Your IP Address

**VERY IMPORTANT:**
1. In cPanel, find **"Remote MySQL"**
2. Add your IP address
3. Get your IP: Open Command Prompt and run:
   ```bash
   curl ifconfig.me
   ```
4. Add that IP to "Access Hosts"

### 6. Update .env.local

Once you have the correct values:

```bash
DB_HOST=matricexcellence.co.za
DB_USER=matricu2f0z0_admin              # Your cPanel username
DB_PASSWORD=your_actual_password         # The password you set
DB_NAME=matricu2f0z0_ACTUAL_DB_NAME     # The actual database name
DB_PORT=3306
```

**Common Database Name Patterns:**
- `matricu2f0z0_kznmatric`
- `matricu2f0z0_production`
- `matricu2f0z0_main`
- etc.

### 7. Test Again

```bash
node test-db-connection.js
```

## Still Not Working?

### Option A: Create New Database

In cPanel → MySQL Databases:
1. **Create New Database**
   - Name it: `kznmatric` (cPanel will prefix it automatically)
   - Final name will be: `matricu2f0z0_kznmatric`

2. **Add User to Database**
   - Select user: `matricu2f0z0_admin`
   - Select database: `matricu2f0z0_kznmatric`
   - Grant **ALL PRIVILEGES**

3. **Update .env.local**
   ```bash
   DB_NAME=matricu2f0z0_kznmatric
   ```

### Option B: Use phpMyAdmin

1. Open **phpMyAdmin** from cPanel
2. You'll see all available databases on the left
3. Click on one to see if it's yours
4. Use that database name in `.env.local`

## Current Issue Analysis

Based on your `.env.local`:
```
DB_NAME=IJOPHLNyCZt2+R!w  ← This is WRONG! This is your password!
```

This should be something like:
```
DB_NAME=matricu2f0z0_kznmatric  ← Actual database name
```

## Quick Checklist

- [ ] Logged into cPanel
- [ ] Found actual database name
- [ ] Verified username (with prefix)
- [ ] Know the password (or reset it)
- [ ] Added my IP to Remote MySQL whitelist
- [ ] Updated `.env.local` with correct values
- [ ] Tested with `node test-db-connection.js`
