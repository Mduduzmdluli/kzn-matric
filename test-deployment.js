#!/usr/bin/env node

/**
 * Deployment Test Script
 * Run this on your cPanel server to diagnose issues
 * Usage: node test-deployment.js
 */

console.log('🔍 Testing Deployment Configuration...\n');

// 1. Check Node.js version
console.log('1️⃣ Node.js Version:');
console.log(`   Version: ${process.version}`);
const [major] = process.version.slice(1).split('.');
if (parseInt(major) < 18) {
  console.log('   ❌ WARNING: Node.js 18+ is recommended');
} else {
  console.log('   ✅ Version is compatible');
}
console.log('');

// 2. Check environment variables
console.log('2️⃣ Environment Variables:');
const requiredEnvVars = [
  'NODE_ENV',
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'DB_PORT',
  'JWT_SECRET',
  'NEXTAUTH_URL',
  'NEXT_PUBLIC_API_URL'
];

let envMissing = false;
requiredEnvVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`   ✅ ${varName}: ${varName.includes('PASSWORD') || varName.includes('SECRET') ? '***' : process.env[varName]}`);
  } else {
    console.log(`   ❌ ${varName}: NOT SET`);
    envMissing = true;
  }
});

if (envMissing) {
  console.log('\n   ⚠️  Missing environment variables! Add them in cPanel Node.js App settings.');
}
console.log('');

// 3. Check required files
console.log('3️⃣ Required Files:');
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'package.json',
  'server.js',
  'next.config.mjs',
  '.next',
  'node_modules'
];

requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
});
console.log('');

// 4. Test database connection
console.log('4️⃣ Database Connection:');
const mysql = require('mysql2/promise');

async function testDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306'),
      connectTimeout: 10000
    });

    console.log('   ✅ Database connection successful!');

    // Try a simple query
    const [rows] = await connection.query('SELECT 1 as test');
    console.log('   ✅ Database query successful!');

    await connection.end();
    return true;
  } catch (error) {
    console.log('   ❌ Database connection failed!');
    console.log(`   Error: ${error.message}`);

    // Suggest solutions
    console.log('\n   💡 Possible solutions:');
    if (error.code === 'ENOTFOUND') {
      console.log('      - Try using "localhost" instead of domain name for DB_HOST');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('      - Check database username and password');
      console.log('      - Ensure database user has permissions');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('      - Check if MySQL server is running');
      console.log('      - Verify DB_HOST and DB_PORT are correct');
    }

    return false;
  }
}

// 5. Check package.json
console.log('');
console.log('5️⃣ Package Configuration:');
try {
  const pkg = require('./package.json');
  console.log(`   Name: ${pkg.name}`);
  console.log(`   Version: ${pkg.version}`);
  console.log(`   Next.js: ${pkg.dependencies.next || 'Not found'}`);
  console.log('   ✅ package.json is valid');
} catch (error) {
  console.log('   ❌ Error reading package.json');
  console.log(`   ${error.message}`);
}
console.log('');

// 6. Check Next.js build
console.log('6️⃣ Next.js Build:');
try {
  const nextPath = path.join(__dirname, '.next');
  const buildId = fs.readFileSync(path.join(nextPath, 'BUILD_ID'), 'utf8');
  console.log(`   Build ID: ${buildId.trim()}`);

  const hasServerJs = fs.existsSync(path.join(nextPath, 'server'));
  const hasStatic = fs.existsSync(path.join(nextPath, 'static'));

  console.log(`   ${hasServerJs ? '✅' : '❌'} Server files`);
  console.log(`   ${hasStatic ? '✅' : '❌'} Static files`);
} catch (error) {
  console.log('   ❌ .next build folder not found or incomplete');
  console.log('   Run "npm run build" locally and upload .next folder');
}
console.log('');

// Run async tests
(async () => {
  await testDatabase();

  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log('📋 Summary');
  console.log('═══════════════════════════════════════════');
  console.log('');
  console.log('If you see ❌ errors above:');
  console.log('1. Fix the issues listed');
  console.log('2. Restart your Node.js app in cPanel');
  console.log('3. Check application logs in cPanel');
  console.log('');
  console.log('For detailed troubleshooting, see TROUBLESHOOTING-CPANEL.md');
  console.log('');
})();
