// Test database connection to Afrihost MySQL
require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('🔍 Testing Afrihost MySQL Database Connection...\n');

  console.log('Connection Details:');
  console.log('  Host:', process.env.DB_HOST);
  console.log('  Port:', process.env.DB_PORT);
  console.log('  User:', process.env.DB_USER);
  console.log('  Database:', process.env.DB_NAME);
  console.log('  Password:', process.env.DB_PASSWORD ? '****' + process.env.DB_PASSWORD.slice(-4) : 'NOT SET');
  console.log('\n');

  try {
    console.log('⏳ Connecting to database...');

    const isLocalhost = process.env.DB_HOST === 'localhost' || process.env.DB_HOST === '127.0.0.1';

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 10000,
      // Disable SSL (Afrihost doesn't support it)
      ssl: false
    });

    console.log('✅ Connected to database successfully!\n');

    // Test: Show database name
    const [dbResult] = await connection.query('SELECT DATABASE() as db');
    console.log('📊 Current Database:', dbResult[0].db);

    // Test: Show tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('\n📋 Tables found:', tables.length);
    if (tables.length > 0) {
      console.log('\nTable list:');
      tables.forEach((table, index) => {
        const tableName = Object.values(table)[0];
        console.log(`  ${index + 1}. ${tableName}`);
      });
    } else {
      console.log('\n⚠️  No tables found. You need to run the schema SQL file.');
      console.log('   Run: mysql -u user -p database < database/schema/complete_database_schema.sql');
    }

    // Test: Check for users table specifically
    const [userTableCheck] = await connection.query(
      "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ? AND table_name = 'users'",
      [process.env.DB_NAME]
    );

    if (userTableCheck[0].count > 0) {
      console.log('\n✅ Users table exists');

      // Count users
      const [userCount] = await connection.query('SELECT COUNT(*) as count FROM users');
      console.log(`   Total users: ${userCount[0].count}`);
    } else {
      console.log('\n⚠️  Users table not found. Please run the database schema.');
    }

    // Test: Check courses
    const [courseTableCheck] = await connection.query(
      "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ? AND table_name = 'courses'",
      [process.env.DB_NAME]
    );

    if (courseTableCheck[0].count > 0) {
      const [courseCount] = await connection.query('SELECT COUNT(*) as count FROM courses');
      console.log(`   Total courses: ${courseCount[0].count}`);
    }

    await connection.end();
    console.log('\n✅ Database connection test completed successfully!');
    console.log('\n👉 Your application is ready to connect to Afrihost MySQL database.');

  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('\nError Details:');
    console.error('  Code:', error.code);
    console.error('  Message:', error.message);

    if (error.code === 'ENOTFOUND') {
      console.error('\n💡 Solution: Check your DB_HOST in .env.local');
      console.error('   The hostname could not be found. Make sure it\'s correct.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Solution: Check your username and password in .env.local');
      console.error('   Make sure they match your Afrihost MySQL credentials.');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      console.error('\n💡 Solution: Check the following:');
      console.error('   1. Your IP is whitelisted in cPanel → Remote MySQL');
      console.error('   2. Port 3306 is open and accessible');
      console.error('   3. The MySQL host address is correct');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 Solution: The database doesn\'t exist');
      console.error('   1. Create the database in cPanel → MySQL Databases');
      console.error('   2. Make sure DB_NAME in .env.local matches the database name');
    }

    console.error('\n📚 For more help, see: AFRIHOST_DATABASE_SETUP.md');
  }
}

testConnection();
