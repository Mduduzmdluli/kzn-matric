// Run database migration on Afrihost MySQL
require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  console.log('🚀 KZN Matric Excellence - Database Migration\n');
  console.log('═'.repeat(60));

  // Read the schema file
  const schemaPath = path.join(__dirname, 'database', 'schema', 'complete_database_schema.sql');

  if (!fs.existsSync(schemaPath)) {
    console.error('❌ Schema file not found at:', schemaPath);
    console.error('   Make sure database/schema/complete_database_schema.sql exists');
    process.exit(1);
  }

  const schema = fs.readFileSync(schemaPath, 'utf8');

  console.log('📋 Migration Details:');
  console.log('  Host:', process.env.DB_HOST);
  console.log('  Database:', process.env.DB_NAME);
  console.log('  User:', process.env.DB_USER);
  console.log('  Schema File:', schemaPath);
  console.log('═'.repeat(60));
  console.log('\n');

  try {
    console.log('⏳ Connecting to database...');

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true, // Allow running multiple SQL statements
      connectTimeout: 15000,
      ssl: false
    });

    console.log('✅ Connected successfully!\n');

    // Split schema into individual statements
    // Remove comments and split by semicolon
    const statements = schema
      .split('\n')
      .filter(line => !line.trim().startsWith('--')) // Remove comment lines
      .join('\n')
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);
    console.log('⏳ Running migration...\n');

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      // Skip empty statements and comments
      if (!statement || statement.startsWith('/*') || statement.startsWith('--')) {
        continue;
      }

      try {
        // Show progress for important statements
        if (statement.includes('CREATE DATABASE')) {
          process.stdout.write('  📁 Creating database... ');
        } else if (statement.includes('CREATE TABLE')) {
          const match = statement.match(/CREATE TABLE.*?`([^`]+)`/i);
          const tableName = match ? match[1] : 'unknown';
          process.stdout.write(`  📊 Creating table: ${tableName}... `);
        } else if (statement.includes('INSERT INTO')) {
          const match = statement.match(/INSERT INTO.*?`([^`]+)`/i);
          const tableName = match ? match[1] : 'unknown';
          process.stdout.write(`  ✏️  Inserting data into: ${tableName}... `);
        } else if (statement.includes('CREATE INDEX')) {
          process.stdout.write('  🔍 Creating index... ');
        } else if (statement.includes('CREATE.*VIEW')) {
          process.stdout.write('  👁️  Creating view... ');
        } else {
          // Skip progress for USE, SET, and other statements
          if (statement.includes('USE ') || statement.includes('SET ')) {
            await connection.query(statement);
            continue;
          }
          process.stdout.write(`  ⚙️  Executing statement ${i + 1}... `);
        }

        await connection.query(statement);
        console.log('✅');
        successCount++;

      } catch (error) {
        if (error.code === 'ER_DB_CREATE_EXISTS' ||
            error.code === 'ER_TABLE_EXISTS_ERROR' ||
            error.message.includes('already exists')) {
          console.log('⏭️  (already exists)');
          skipCount++;
        } else {
          console.log('❌');
          console.error('     Error:', error.message);
          errorCount++;
        }
      }
    }

    console.log('\n' + '═'.repeat(60));
    console.log('📊 Migration Summary:');
    console.log(`  ✅ Successful: ${successCount}`);
    console.log(`  ⏭️  Skipped (already exists): ${skipCount}`);
    console.log(`  ❌ Errors: ${errorCount}`);
    console.log('═'.repeat(60));

    // Verify tables were created
    console.log('\n🔍 Verifying database structure...\n');

    const [tables] = await connection.query(`SHOW TABLES FROM \`${process.env.DB_NAME}\``);
    console.log(`✅ Total tables created: ${tables.length}`);

    if (tables.length > 0) {
      console.log('\n📋 Tables in database:');
      tables.forEach((table, index) => {
        const tableName = Object.values(table)[0];
        console.log(`  ${index + 1}. ${tableName}`);
      });
    }

    // Check data in courses table
    const [courseCount] = await connection.query(`SELECT COUNT(*) as count FROM courses`);
    console.log(`\n📚 Courses available: ${courseCount[0].count}`);

    // Check roles
    const [roleCount] = await connection.query(`SELECT COUNT(*) as count FROM roles`);
    console.log(`👥 Roles configured: ${roleCount[0].count}`);

    await connection.end();

    console.log('\n' + '═'.repeat(60));
    console.log('🎉 Migration completed successfully!');
    console.log('═'.repeat(60));
    console.log('\n💡 Next Steps:');
    console.log('  1. Test connection: node test-db-connection.js');
    console.log('  2. Start dev server: npm run dev');
    console.log('  3. Test registration: http://localhost:3000/signup');
    console.log('\n');

  } catch (error) {
    console.error('\n❌ Migration failed!');
    console.error('\nError Details:');
    console.error('  Code:', error.code);
    console.error('  Message:', error.message);

    if (error.code === 'ENOTFOUND') {
      console.error('\n💡 The database host could not be found.');
      console.error('   Check DB_HOST in .env.local');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Access denied. Check your credentials:');
      console.error('   - DB_USER');
      console.error('   - DB_PASSWORD');
      console.error('   - Make sure your IP is whitelisted in cPanel → Remote MySQL');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 Database does not exist.');
      console.error('   Create it in cPanel → MySQL Databases first');
    }

    console.error('\n📚 See: check-afrihost-credentials.md for help');
    process.exit(1);
  }
}

runMigration();
