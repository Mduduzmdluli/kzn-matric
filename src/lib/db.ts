import mysql from 'mysql2/promise';
import type { Pool } from 'mysql2/promise';

// Lazy initialization of the pool to avoid connection during build
let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root@12345',
      database: process.env.DB_NAME || 'kzn-matric',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      // Disable SSL for local development, enable for production
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : undefined,
    });
  }
  return pool;
}

// Test the connection
export async function testConnection() {
    try {
        const connection = await getPool().getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
}

export default getPool();