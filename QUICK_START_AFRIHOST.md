# Quick Start: Connect to Afrihost MySQL Database

## 🚀 5-Minute Setup

### Step 1: Get Afrihost Credentials (2 minutes)

1. Log into your **Afrihost cPanel**
2. Go to **"Databases"** → **"MySQL Databases"**
3. Note down:
   - MySQL Host (usually `mysql.yourdomain.co.za`)
   - Database name
   - Username
   - Password (or create a new user)

### Step 2: Update .env.local (1 minute)

Replace these lines in `.env.local`:

```bash
DB_HOST=mysql.yourdomain.co.za          # ← Your Afrihost MySQL host
DB_USER=your_username                    # ← Your MySQL username
DB_PASSWORD=your_password                # ← Your MySQL password
DB_NAME=kzn-matric                      # ← Your database name
```

**Real example:**
```bash
DB_HOST=mysql.matricexcellence.co.za
DB_USER=matric_user
DB_PASSWORD=SecurePass123!
DB_NAME=matric_production
```

### Step 3: Whitelist Your IP (1 minute)

In cPanel:
1. Go to **"Remote MySQL"**
2. Add your IP address (run `curl ifconfig.me` to get it)
3. Click **"Add Host"**

### Step 4: Create Tables on Afrihost (1 minute)

**Using phpMyAdmin (easiest):**
1. Open **phpMyAdmin** from cPanel
2. Select your database
3. Click **"SQL"** tab
4. Paste contents from `database/schema/complete_database_schema.sql`
5. Click **"Go"**

### Step 5: Test Connection (30 seconds)

```bash
node test-db-connection.js
```

You should see:
```
✅ Connected to database successfully!
📊 Current Database: kzn-matric
📋 Tables found: 14
```

## ✅ Done!

Your app now connects to Afrihost instead of localhost.

## 🧪 Verify It Works

Start your development server:
```bash
npm run dev
```

Visit: `http://localhost:3000/api/test-db`

Should return:
```json
{
  "message": "Database connected successfully",
  "database": "kzn-matric"
}
```

## 🔄 Switch Back to Localhost

To use local database again, edit `.env.local`:

```bash
# Comment out Afrihost, uncomment localhost:
# DB_HOST=mysql.matricexcellence.co.za
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root@12345
```

## 📞 Need Help?

See detailed guide: [AFRIHOST_DATABASE_SETUP.md](./AFRIHOST_DATABASE_SETUP.md)
