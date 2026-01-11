# Connecting to Afrihost MySQL Database

This guide explains how to connect your KZN Matric Excellence application to an Afrihost-hosted MySQL database.

## Step 1: Get Your Afrihost Database Credentials

Log into your Afrihost cPanel or hosting control panel and locate your MySQL database credentials:

### Required Information:
- **MySQL Host/Server**: Usually `mysql.yourdomain.co.za` or similar
- **Database Name**: Your database name (e.g., `kzn-matric`)
- **Username**: Your MySQL username
- **Password**: Your MySQL password
- **Port**: Usually `3306` (default)

### Where to Find These:

**Option A: cPanel**
1. Log into cPanel
2. Go to "Databases" → "MySQL Databases"
3. Note down your database name and username
4. The hostname is usually shown at the top or in phpMyAdmin

**Option B: Contact Afrihost Support**
- Email: support@afrihost.com
- They can provide your MySQL connection details

## Step 2: Update Your `.env.local` File

Open `.env.local` and replace the placeholders with your actual Afrihost credentials:

```bash
# ===================================
# DATABASE CONFIGURATION
# ===================================
# Afrihost MySQL Database Configuration
DB_HOST=mysql.yourdomain.co.za        # Replace with your Afrihost MySQL host
DB_USER=your_database_username         # Replace with your username
DB_PASSWORD=your_database_password     # Replace with your password
DB_NAME=kzn-matric                    # Your database name
DB_PORT=3306                          # Usually 3306
```

**Example with real values:**
```bash
DB_HOST=mysql.matricexcellence.co.za
DB_USER=matric_admin
DB_PASSWORD=SecurePass123!
DB_NAME=matric_db
DB_PORT=3306
```

## Step 3: Create the Database on Afrihost

You need to create the database tables on your Afrihost server. You have two options:

### Option A: Using phpMyAdmin (Recommended)

1. Log into your Afrihost cPanel
2. Open **phpMyAdmin**
3. Select your database from the left sidebar
4. Click the **SQL** tab
5. Copy and paste the contents of `database/schema/complete_database_schema.sql`
6. Click **Go** to execute

### Option B: Using MySQL Command Line (if SSH access available)

If Afrihost provides SSH access:

```bash
# SSH into your server
ssh username@yourdomain.co.za

# Upload the schema file via SFTP first, then:
mysql -u your_username -p your_database_name < complete_database_schema.sql
```

### Option C: Import via cPanel

1. Log into cPanel
2. Go to **MySQL Databases**
3. Look for **Import** or use phpMyAdmin's Import feature
4. Upload `database/schema/complete_database_schema.sql`
5. Execute

## Step 4: Test the Connection

### Using the Test Endpoint

1. Start your development server:
```bash
npm run dev
```

2. Navigate to: `http://localhost:3000/api/test-db`

You should see:
```json
{
  "message": "Database connected successfully",
  "database": "kzn-matric"
}
```

### Using Node Script

Create a test file `test-db-connection.js`:

```javascript
require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false }
    });

    console.log('✅ Connected to Afrihost MySQL database successfully!');

    const [rows] = await connection.query('SHOW TABLES');
    console.log('\nTables found:', rows.length);
    console.table(rows);

    await connection.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
```

Run it:
```bash
node test-db-connection.js
```

## Step 5: Whitelist Your IP (Important!)

Afrihost may require you to whitelist your IP address for remote MySQL access:

1. Log into cPanel
2. Go to **"Remote MySQL"**
3. Add your current IP address
4. If deploying to Vercel/Netlify, you may need to whitelist their IP ranges

### Get Your Current IP:
```bash
curl ifconfig.me
```

## Common Afrihost Database Hostnames

Afrihost typically uses these patterns:
- `mysql.yourdomain.co.za`
- `server123.hosting.afrihost.com`
- `mysqlXX.afrihost.com` (where XX is a number)

Check your cPanel or contact support if unsure.

## Troubleshooting

### Error: "Can't connect to MySQL server"

**Possible causes:**
1. **Wrong hostname** - Double-check your MySQL host
2. **IP not whitelisted** - Add your IP in cPanel → Remote MySQL
3. **Firewall blocking** - Check if port 3306 is open
4. **Wrong credentials** - Verify username and password

**Solution:**
```bash
# Test if port 3306 is accessible
telnet your-mysql-host.co.za 3306
# Or on Windows:
Test-NetConnection -ComputerName your-mysql-host.co.za -Port 3306
```

### Error: "Access denied for user"

**Cause:** Wrong username or password

**Solution:**
1. Reset your MySQL password in cPanel
2. Make sure username includes any prefixes (e.g., `cpanel_username`)
3. Check for special characters that may need escaping in `.env.local`

### Error: "Unknown database"

**Cause:** Database doesn't exist on the server

**Solution:**
1. Create the database in cPanel → MySQL Databases
2. Run the schema SQL to create tables
3. Update `DB_NAME` in `.env.local`

### Error: "SSL connection error"

**Cause:** SSL configuration issues

**Solution:**
Try disabling SSL verification (already configured in `db.ts`):
```javascript
ssl: { rejectUnauthorized: false }
```

### Connection Timeout

**Cause:** Slow network or server not responding

**Solution:**
Increase timeout in `src/lib/db.ts`:
```javascript
connectTimeout: 30000, // 30 seconds instead of 10
```

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):

### Environment Variables

Set these in your deployment platform:

```
DB_HOST=mysql.yourdomain.co.za
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=kzn-matric
DB_PORT=3306
NODE_ENV=production
```

### IP Whitelisting for Vercel

Vercel doesn't have fixed IPs. Options:

1. **Use Vercel's Edge Network** - Contact Afrihost to whitelist Vercel's IP ranges
2. **Use a database proxy** like PlanetScale or Railway
3. **Use Afrihost's web-accessible MySQL** (if available)

## Security Best Practices

1. ✅ Never commit `.env.local` to Git (already in `.gitignore`)
2. ✅ Use strong, unique passwords
3. ✅ Only whitelist necessary IPs
4. ✅ Enable SSL for production connections
5. ✅ Regularly backup your database
6. ✅ Use different credentials for dev and production

## Need Help?

**Afrihost Support:**
- Website: https://www.afrihost.com
- Email: support@afrihost.com
- Phone: 087 470 0000

**Database Issues:**
- Check logs in your Next.js console
- Use phpMyAdmin to verify tables exist
- Test connection with MySQL Workbench
