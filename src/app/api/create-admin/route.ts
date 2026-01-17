import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
    let connection = null;

    try {
        // Get a connection from the pool
        connection = await pool.getConnection();

        console.log('✅ Connected to MySQL Database');

        // Check if admin already exists
        const [existingUsers]: any = await connection.execute(
            'SELECT id, username FROM users WHERE username = ?',
            ['admin']
        );

        if (Array.isArray(existingUsers) && existingUsers.length > 0) {
            return NextResponse.json({
                success: false,
                message: '⚠️ Admin user already exists',
                username: existingUsers[0].username,
            });
        }

        // Check if identity_types table has data
        const [identityTypes]: any = await connection.query(
            'SELECT id FROM identity_types LIMIT 1'
        );

        const identityTypeId = identityTypes.length > 0 ? identityTypes[0].id : null;

        // Hash the password
        const hashedPassword = await bcrypt.hash('Admin@2680', 10);

        // Insert admin user (identity_type_id can be NULL if table is empty)
        const [result] = await connection.execute(
            `INSERT INTO users
                (first_name, last_name, username, password, role_id, user_type,
                 identity_type_id, identity_reference, is_active, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
                'Admin',
                'User',
                'admin',
                hashedPassword,
                1, // role_id: 1 for admin
                1, // user_type: 1 for admin
                identityTypeId, // Use NULL if no identity types exist
                '9803025869085', // identity_reference
                1, // is_active: true
            ]
        );

        return NextResponse.json({
            success: true,
            message: '✅ Admin user created successfully!',
            credentials: {
                username: 'admin',
                password: 'Admin@123',
                roleId: 1,
            },
            warning: '⚠️ IMPORTANT: Change the password after first login!',
        });

    } catch (error: any) {
        console.error('❌ Error creating admin user:', error.message);

        return NextResponse.json(
            {
                success: false,
                message: '❌ Error creating admin user',
                error: error.message,
                code: error.code,
                details: process.env.NODE_ENV === 'production' ? undefined : error.stack,
            },
            { status: 500 }
        );
    } finally {
        if (connection) {
            connection.release();
        }
    }
}
