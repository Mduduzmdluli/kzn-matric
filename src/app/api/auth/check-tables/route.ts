import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
    try {
        const requiredTables = [
            'users',
            'addresses',
            'contacts',
            'parents',
            'parent_addresses',
            'schools',
            'student_parents',
            'student_schools',
            'student_courses',
            'courses',
        ];

        const tableStatus: Record<string, any> = {};

        for (const tableName of requiredTables) {
            try {
                // Check if table exists
                const [tables] = await pool.query(
                    `SHOW TABLES LIKE ?`,
                    [tableName]
                );

                if (Array.isArray(tables) && tables.length > 0) {
                    // Table exists, get column info
                    const [columns] = await pool.query(`DESCRIBE ${tableName}`);
                    tableStatus[tableName] = {
                        exists: true,
                        columns: columns,
                    };
                } else {
                    tableStatus[tableName] = {
                        exists: false,
                        error: 'Table does not exist',
                    };
                }
            } catch (error: any) {
                tableStatus[tableName] = {
                    exists: false,
                    error: error.message,
                };
            }
        }

        const missingTables = Object.entries(tableStatus)
            .filter(([_, status]) => !status.exists)
            .map(([name, _]) => name);

        return NextResponse.json({
            success: missingTables.length === 0,
            message: missingTables.length === 0
                ? '✅ All required tables exist'
                : `❌ Missing tables: ${missingTables.join(', ')}`,
            database: process.env.DB_NAME,
            tables: tableStatus,
            missingTables,
        });

    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error.message,
            },
            { status: 500 }
        );
    }
}
