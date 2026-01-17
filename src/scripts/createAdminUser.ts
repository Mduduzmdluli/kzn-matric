import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const createAdminUser = async () => {
  let connection;

  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'matricexcellence.co.za',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'matricu2f0z0_admin',
      password: process.env.DB_PASSWORD || 'IJOPHLNyCZt2+R!w',
      database: process.env.DB_NAME || 'matricu2f0z0_kzn-matric',
    });

    console.log('✅ Connected to MySQL Database');

    // Check if admin already exists
    const [existingUsers] = await connection.execute(
      'SELECT id, username FROM users WHERE username = ?',
      ['admin@gmail.com']
    );

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      console.log('⚠️  Admin user already exists');
      console.log('Username:', (existingUsers[0] as any).username);
      process.exit(0);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('Admin@2680', 10);

    // Insert admin user
    const [result] = await connection.execute(
      `INSERT INTO users 
        (first_name, last_name, username, password, role_id, user_type, 
         identity_reference, is_active, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        'Admin',
        'User',
        'admin',
        hashedPassword,
        1, // role_id: 1 for admin (adjust based on your system)
        1, // user_type: 1 for admin
        '9803025869085', // identity_reference
        1, // is_active: true
      ]
    );

    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Username: admin@gmail.com');
    console.log('🔑 Password: Admin@123');
    console.log('👔 Role ID: 1');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  IMPORTANT: Change the password after first login!');

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error creating admin user:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

// Run the script
createAdminUser();