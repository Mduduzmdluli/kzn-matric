#!/usr/bin/env node

/**
 * Production Server Diagnostic Script
 * Upload this to your server and run: node check-production.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Production Server Configuration...\n');
console.log('═══════════════════════════════════════════════════════\n');

let issuesFound = 0;

// 1. Check critical files
console.log('1️⃣ Checking Critical Files:\n');

const criticalFiles = [
  { path: 'package.json', required: true },
  { path: 'server.js', required: true },
  { path: 'next.config.mjs', required: true },
  { path: '.htaccess', required: true },
  { path: '.next', required: true, isDir: true },
  { path: '.next/BUILD_ID', required: true },
  { path: 'node_modules', required: true, isDir: true },
  { path: 'node_modules/next', required: true, isDir: true },
  { path: 'public', required: false, isDir: true },
];

criticalFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file.path);
  const exists = fs.existsSync(fullPath);

  if (exists) {
    if (file.isDir) {
      const files = fs.readdirSync(fullPath);
      console.log(`   ✅ ${file.path}/ (${files.length} items)`);
    } else {
      const stats = fs.statSync(fullPath);
      console.log(`   ✅ ${file.path} (${stats.size} bytes)`);
    }
  } else {
    if (file.required) {
      console.log(`   ❌ ${file.path} - MISSING (REQUIRED)`);
      issuesFound++;
    } else {
      console.log(`   ⚠️  ${file.path} - Not found (optional)`);
    }
  }
});

console.log('');

// 2. Check .next build
console.log('2️⃣ Checking Next.js Build:\n');

try {
  const nextPath = path.join(process.cwd(), '.next');

  if (fs.existsSync(nextPath)) {
    // Check BUILD_ID
    const buildIdPath = path.join(nextPath, 'BUILD_ID');
    if (fs.existsSync(buildIdPath)) {
      const buildId = fs.readFileSync(buildIdPath, 'utf8').trim();
      console.log(`   ✅ Build ID: ${buildId}`);
    } else {
      console.log(`   ❌ BUILD_ID missing - run 'npm run build'`);
      issuesFound++;
    }

    // Check server files
    const serverPath = path.join(nextPath, 'server');
    const hasServer = fs.existsSync(serverPath);
    console.log(`   ${hasServer ? '✅' : '❌'} Server directory: ${hasServer ? 'exists' : 'missing'}`);
    if (!hasServer) issuesFound++;

    // Check static files
    const staticPath = path.join(nextPath, 'static');
    const hasStatic = fs.existsSync(staticPath);
    console.log(`   ${hasStatic ? '✅' : '❌'} Static directory: ${hasStatic ? 'exists' : 'missing'}`);
    if (!hasStatic) issuesFound++;
  } else {
    console.log(`   ❌ .next directory not found - run 'npm run build' locally and upload`);
    issuesFound++;
  }
} catch (error) {
  console.log(`   ❌ Error checking .next: ${error.message}`);
  issuesFound++;
}

console.log('');

// 3. Check environment variables
console.log('3️⃣ Checking Environment Variables:\n');

const requiredEnvVars = [
  'NODE_ENV',
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'NEXTAUTH_URL',
  'NEXT_PUBLIC_API_URL',
];

requiredEnvVars.forEach(varName => {
  if (process.env[varName]) {
    const value = ['PASSWORD', 'SECRET'].some(s => varName.includes(s))
      ? '***'
      : process.env[varName];
    console.log(`   ✅ ${varName}: ${value}`);
  } else {
    console.log(`   ❌ ${varName}: NOT SET`);
    issuesFound++;
  }
});

console.log('');

// 4. Check Node.js version
console.log('4️⃣ Checking Node.js Version:\n');
console.log(`   Node.js: ${process.version}`);
const [major] = process.version.slice(1).split('.');
if (parseInt(major) >= 18) {
  console.log(`   ✅ Version is compatible (18+ required)`);
} else {
  console.log(`   ❌ Version too old (18+ required)`);
  issuesFound++;
}

console.log('');

// 5. Check package.json
console.log('5️⃣ Checking Package Configuration:\n');

try {
  const pkgPath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    console.log(`   Name: ${pkg.name}`);
    console.log(`   Version: ${pkg.version}`);
    console.log(`   Next.js: ${pkg.dependencies?.next || 'NOT FOUND'}`);

    if (!pkg.dependencies?.next) {
      console.log(`   ❌ Next.js not in dependencies`);
      issuesFound++;
    } else {
      console.log(`   ✅ package.json is valid`);
    }
  }
} catch (error) {
  console.log(`   ❌ Error reading package.json: ${error.message}`);
  issuesFound++;
}

console.log('');

// 6. Check database connection
console.log('6️⃣ Testing Database Connection:\n');

async function testDatabase() {
  try {
    const mysql = require('mysql2/promise');

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306'),
      connectTimeout: 5000
    });

    console.log(`   ✅ Database connected successfully!`);
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);

    // Test query
    const [rows] = await connection.query('SELECT 1 as test');
    console.log(`   ✅ Database query successful`);

    await connection.end();
  } catch (error) {
    console.log(`   ❌ Database connection failed`);
    console.log(`   Error: ${error.message}`);
    console.log(`   Code: ${error.code}`);

    if (error.code === 'ENOTFOUND') {
      console.log(`   💡 Try: SetEnv DB_HOST localhost (in .htaccess)`);
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log(`   💡 Check: DB_USER and DB_PASSWORD in .htaccess`);
    }

    issuesFound++;
  }
}

// 7. Summary
async function runChecks() {
  await testDatabase();

  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('📊 SUMMARY');
  console.log('═══════════════════════════════════════════════════════\n');

  if (issuesFound === 0) {
    console.log('✅ All checks passed! Your configuration looks good.');
    console.log('');
    console.log('If still getting 503:');
    console.log('1. Restart app in cPanel');
    console.log('2. Check error logs in cPanel');
    console.log('3. Wait 30 seconds after restart');
  } else {
    console.log(`❌ Found ${issuesFound} issue(s) that need attention.`);
    console.log('');
    console.log('Fix the issues above, then:');
    console.log('1. Run this script again');
    console.log('2. Restart app in cPanel');
  }

  console.log('');
  console.log('📖 See PRODUCTION-DEPLOYMENT-CHECKLIST.md for detailed fixes');
  console.log('');
}

runChecks().catch(err => {
  console.error('Error running checks:', err);
  process.exit(1);
});
