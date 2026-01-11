import mysql from 'mysql2/promise';
import type { Pool } from 'mysql2/promise';

// Lazy initialization of the pool to avoid connection during build
let poolInstance: Pool | null = null;

function getPool(): Pool {
  if (!poolInstance) {
    const isLocalhost = process.env.DB_HOST === 'localhost' || process.env.DB_HOST === '127.0.0.1';

    poolInstance = mysql.createPool({
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
      connectTimeout: 10000, // 10 seconds
      // Disable SSL if server doesn't support it
      ssl: false,
    });
  }
  return poolInstance;
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

// Export a lazy pool wrapper to avoid connection during build
const pool = {
  query: (...args: Parameters<Pool['query']>) => getPool().query(...args),
  execute: (...args: Parameters<Pool['execute']>) => getPool().execute(...args),
  getConnection: () => getPool().getConnection(),
  end: () => getPool().end(),
} as Pool;

export default pool;