import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface User extends RowDataPacket {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: Date;
}

export async function GET(request: NextRequest) {
    try {
        // Verify authentication
        const authUser = requireAuth(request);

        // Fetch user data from database
        const [users] = await pool.query<User[]>(
            'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
            [authUser.userId]
        );

        if (users.length === 0) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const user = users[0];

        return NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.created_at
            }
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        console.error('Profile fetch error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const authUser = requireAuth(request);
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json(
                { error: 'Name is required' },
                { status: 400 }
            );
        }

        await pool.query(
            'UPDATE users SET name = ? WHERE id = ?',
            [name, authUser.userId]
        );

        return NextResponse.json({
            message: 'Profile updated successfully',
            user: { name }
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        console.error('Profile update error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}