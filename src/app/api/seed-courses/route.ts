import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
    let connection = null;

    try {
        connection = await pool.getConnection();

        // Check if courses already exist
        const [existing]: any = await connection.query('SELECT COUNT(*) as count FROM courses');

        if (existing[0].count > 0) {
            return NextResponse.json({
                success: false,
                message: `⚠️ Courses already exist (${existing[0].count} courses found)`,
                count: existing[0].count,
            });
        }

        // Insert courses based on matric subjects
        const courses = [
            { id: 1, name: 'Mathematics', description: 'Pure Mathematics for Grade 12' },
            { id: 2, name: 'Physical Sciences', description: 'Physics and Chemistry for Grade 12' },
            { id: 3, name: 'Life Sciences', description: 'Biology for Grade 12' },
            { id: 4, name: 'Accounting', description: 'Financial Accounting for Grade 12' },
            { id: 5, name: 'English Home Language', description: 'English Language and Literature' },
            { id: 6, name: 'Afrikaans', description: 'Afrikaans Language' },
            { id: 7, name: 'Geography', description: 'Physical and Human Geography' },
            { id: 8, name: 'History', description: 'South African and World History' },
            { id: 9, name: 'Business Studies', description: 'Business Management and Entrepreneurship' },
            { id: 10, name: 'Economics', description: 'Micro and Macroeconomics' },
            { id: 11, name: 'Mathematical Literacy', description: 'Applied Mathematics for everyday life' },
            { id: 12, name: 'Information Technology', description: 'Computer Applications and Programming' },
        ];

        const insertQuery = `
            INSERT INTO courses (id, name, description, is_active, created_at, updated_at)
            VALUES (?, ?, ?, 1, NOW(), NOW())
        `;

        for (const course of courses) {
            await connection.execute(insertQuery, [course.id, course.name, course.description]);
        }

        return NextResponse.json({
            success: true,
            message: `✅ Successfully inserted ${courses.length} courses!`,
            courses: courses.map(c => ({ id: c.id, name: c.name })),
        });

    } catch (error: any) {
        console.error('❌ Error seeding courses:', error.message);

        return NextResponse.json(
            {
                success: false,
                message: '❌ Error seeding courses',
                error: error.message,
                code: error.code,
            },
            { status: 500 }
        );
    } finally {
        if (connection) {
            connection.release();
        }
    }
}
