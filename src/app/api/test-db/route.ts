import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/db';
import pool from '@/lib/db';

export async function GET() {
    try {
        // Test basic connection
        const isConnected = await testConnection();

        if (!isConnected) {
            return NextResponse.json(
                {
                    success: false,
                    connected: false,
                    message: '❌ Database connection failed',
                    error: 'Could not establish connection to MySQL database'
                },
                { status: 500 }
            );
        }

        // Try to query the database
        try {
            const [rows] = await pool.query('SELECT 1 + 1 AS result');
            const [databases] = await pool.query('SHOW DATABASES');

            return NextResponse.json({
                success: true,
                connected: true,
                message: '✅ Database connected successfully',
                timestamp: new Date().toISOString(),
                testQuery: rows,
                availableDatabases: databases,
                config: {
                    host: process.env.DB_HOST || 'localhost',
                    database: process.env.DB_NAME || 'elearning',
                    user: process.env.DB_USER || 'root'
                }
            });
        } catch (queryError: any) {
            return NextResponse.json(
                {
                    success: false,
                    connected: true,
                    message: '⚠️ Connected but query failed',
                    error: queryError.message
                },
                { status: 500 }
            );
        }
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                connected: false,
                message: '❌ Database connection error',
                error: error.message,
                details: error.code || 'Unknown error'
            },
            { status: 500 }
        );
    }
}