import mysql from 'mysql2/promise';
import type { Pool } from 'mysql2/promise';

// Lazy initialization of the pool to avoid connection during build
let poolInstance: Pool | null = null;

function getPool(): Pool {
  // Always recreate the pool to ensure we get fresh environment variables
  // This is necessary because Passenger sets env vars at runtime, not build time
  const dbConfig = {
    host: process.env.DB_HOST || 'kznmatricexcellence.c7kqo2m4kslb.eu-west-2.rds.amazonaws.com',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'adminmatricexcellence',
    password: process.env.DB_PASSWORD || 'IJOPHLNyCZt2+R!w',
    database: process.env.DB_NAME || 'kznmatricexcellence',
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'), // Can scale up on AWS
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    connectTimeout: 10000, // 10 seconds
  };

  // Only create pool once, but always at runtime (not during build)
  if (!poolInstance) {
    poolInstance = mysql.createPool(dbConfig);
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