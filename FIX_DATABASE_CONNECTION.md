# Fix Database Connection - Quick Guide

## ⚠️ Current Issue

Your `.env.local` has the **wrong database name**:

```bash
DB_NAME=IJOPHLNyCZt2+R!w  ← This is your PASSWORD, not the database name!
```

## ✅ How to Fix

### Step 1: Find Your Correct Database Name

**Option A: Check cPanel**
1. Log into: https://www.matricexcellence.co.za/cpanel
2. Go to: **MySQL Databases**
3. Look at **"Current Databases"** section
4. Your database name will be like:
   - `matricu2f0z0_kznmatric`
   - `matricu2f0z0_main`
   - `matricu2f0z0_production`

**Option B: Create New Database**
1. In cPanel → MySQL Databases
2. Create database named: `kznmatric`
3. cPanel will make it: `matricu2f0z0_kznmatric`
4. Add user `matricu2f0z0_admin` to this database
5. Grant **ALL PRIVILEGES**

### Step 2: Whitelist Your IP

**CRITICAL STEP:**
1. In cPanel, go to **"Remote MySQL"**
2. Run this command to get your IP:
   ```bash
   curl ifconfig.me
   ```
3. Add that IP address to "Access Hosts"
4. Click "Add Host"

### Step 3: Update .env.local

Replace `DB_NAME` with the **actual database name**:

```bash
DB_HOST=matricexcellence.co.za
DB_USER=matricu2f0z0_admin
DB_PASSWORD=IJOPHLNyCZt2+R!w
DB_NAME=matricu2f0z0_kznmatric    ← CHANGE THIS to your actual database name
DB_PORT=3306
```

### Step 4: Test Connection

```bash
node test-db-connection.js
```

If successful, you'll see:
```
✅ Connected to database successfully!
📊 Current Database: matricu2f0z0_kznmatric
```

### Step 5: Run Migration

```bash
node run-migration.js
```

This will create all 14 tables in your database.

## 🔍 Quick Troubleshooting

### "Access denied"
- Wrong username, password, or database name
- IP not whitelisted in Remote MySQL
- **Solution:** Double-check credentials in cPanel

### "Database does not exist"
- Database not created yet
- **Solution:** Create database in cPanel → MySQL Databases

### "Cannot connect"
- Wrong hostname
- Firewall blocking port 3306
- **Solution:** Verify DB_HOST is `matricexcellence.co.za`

## 📋 Expected Database Structure

After migration, you should have:
- ✅ 14 tables
- ✅ 13 courses pre-loaded
- ✅ 4 user roles
- ✅ All relationships and indexes

## 🎯 What to Check in cPanel

1. **MySQL Databases**
   - Current Databases: Find your database name
   - Current Users: Should see `matricu2f0z0_admin`

2. **Remote MySQL**
   - Access Hosts: Add your IP address

3. **phpMyAdmin** (optional)
   - View all databases
   - Run SQL queries directly

## Still Having Issues?

See detailed guide: [check-afrihost-credentials.md](./check-afrihost-credentials.md)
