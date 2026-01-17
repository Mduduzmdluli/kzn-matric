import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
    // First, show what environment variables are set
    const envStatus = {
        DB_HOST: process.env.DB_HOST || 'NOT SET',
        DB_PORT: process.env.DB_PORT || 'NOT SET',
        DB_USER: process.env.DB_USER || 'NOT SET',
        DB_PASSWORD: process.env.DB_PASSWORD ? '***SET***' : 'NOT SET',
        DB_NAME: process.env.DB_NAME || 'NOT SET',
        NODE_ENV: process.env.NODE_ENV || 'NOT SET',
    };

    try {
        // Try direct connection with detailed error handling
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '3306'),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            connectTimeout: 10000,
        });

        // Test query
        const [rows] = await connection.query('SELECT 1 + 1 AS result, NOW() as currentTime');

        // Try to show databases
        let databases: any = [];
        try {
            const [dbs] = await connection.query('SHOW DATABASES');
            databases = dbs;
        } catch (e) {
            databases = [{ error: 'No permission to show databases' }];
        }

        await connection.end();

        return NextResponse.json({
            success: true,
            connected: true,
            message: '✅ Database connected successfully',
            timestamp: new Date().toISOString(),
            environment: envStatus,
            testQuery: rows,
            availableDatabases: databases,
        });

    } catch (error: any) {
        const troubleshootingMap: Record<string, string> = {
            'ER_ACCESS_DENIED_ERROR': 'Wrong username or password',
            'ENOTFOUND': 'Database host not found - check DB_HOST',
            'ECONNREFUSED': 'Database server not running or firewall blocking',
            'ER_DBACCESS_DENIED_ERROR': 'User has no access to this database',
        };

        return NextResponse.json(
            {
                success: false,
                connected: false,
                message: '❌ Database connection failed',
                environment: envStatus,
                error: {
                    message: error.message,
                    code: error.code,
                    errno: error.errno,
                    sqlState: error.sqlState,
                    sqlMessage: error.sqlMessage,
                },
                troubleshooting: troubleshootingMap[error.code] || 'Check error code above'
            },
            { status: 500 }
        );
    }
}