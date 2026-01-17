import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { PoolConnection } from 'mysql2/promise';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    let connection: PoolConnection | null = null;

    try {
        const data = await request.json();

        const {
            first_name,
            last_name,
            username,
            password,
            user_type,
            role_id,
            identity_type_id,
            nationality,
            identity_reference,
            interested_courses,
            address,
            contact,
            school,
            parent,
            documents
        } = data;

        const { phone, email, tel_no } = contact || {};
        const { name, centre_no, school_phone, subjects ,school_city } = school || {};
        const { address_line_1, city, postal_code, province, country, address_type_id } = address || {};
        const { first_nameP,last_nameP, genderP, identity_referenceP,identity_type_idP, nationalityP, phoneP, relationshipP, occupationP, address_lineP, cityP, provinceP, postal_codeP, countryP, address_type_idP} = parent || {};
        const { idDocument, matricDocument } = documents || {};

        // --- Validation Checks ---
        if (!first_name || !last_name || !username || !email || !password || !identity_reference) {
            return NextResponse.json(
                { success: false, error: 'Required fields are missing' },
                { status: 400 }
            );
        }
        // (Existing email/password/existence checks here...)
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const [existingEmail] = await pool.query<RowDataPacket[]>(
            'SELECT id FROM users WHERE username = ?',
            [email]
        );

        if (existingEmail.length > 0) {
            return NextResponse.json(
                { success: false, error: 'Email already registered' },
                { status: 409 }
            );
        }

        // Check if identity_reference already exists
        const [existingIdNumber] = await pool.query<RowDataPacket[]>(
            'SELECT id FROM users WHERE identity_reference = ?',
            [identity_reference]
        );

        if (existingIdNumber.length > 0) {
            return NextResponse.json(
                { success: false, error: 'ID number already registered' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // --- Transaction Start ---
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 1. Insert user into the 'users' table
        const userQuery = `
            INSERT INTO users (
                first_name, last_name, username, password, gender, nationality,
                user_type, role_id, identity_type_id, identity_reference,
                id_document_url, matric_document_url, is_active
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        `;

        const userValues = [
            first_name,
            last_name,
            username,
            hashedPassword,
            data.gender || 'Male', // Add gender field
            nationality || null,
            user_type || 2,
            role_id || 4,
            identity_type_id || 1,
            identity_reference,
            idDocument ? idDocument.name : null, // Store filename only
            matricDocument ? matricDocument.name : null, // Store filename only
        ];

        const [userResult]: any = await connection.query(userQuery, userValues);
        const user_id = userResult.insertId;

        // 2. Insert address into the 'addresses' table
        if (address_line_1 || city || province || postal_code || country) {
            const addressQuery = `
                INSERT INTO addresses (
                    user_id, address_line_1, city, province, postal_code, address_type_id, country
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            const addressValues = [
                user_id,
                address_line_1 || null,
                city || null,
                province || null,
                postal_code || null,
                address_type_id || 1,
                country || null,
            ];

            await connection.query(addressQuery, addressValues);
        }

        // 3. Insert contact info into the 'contacts' table
        if (phone || email) {
            const contactQuery = `
                INSERT INTO contacts (
                    user_id, email, phone, tel_no
                ) VALUES (?, ?, ?, ?)
            `;

            const contactValues = [
                user_id,
                email,
                phone || null,
                tel_no || null
            ];

            await connection.query(contactQuery, contactValues);
        }

        // 4. Insert parent details into the 'parents' table
        if (first_nameP || last_nameP || identity_referenceP || phoneP) {
            const parentQuery = `
                INSERT INTO parents (
                    first_name, last_name, gender, phone, relationship,
                    occupation, nationality, identity_type_id, identity_reference
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const parentValues = [
                first_nameP,
                last_nameP,
                genderP,
                phoneP,
                relationshipP || null,
                occupationP || null,
                nationalityP || null,
                identity_type_idP || 1,
                identity_referenceP,
            ];

            const [parentResult]: any = await connection.query(parentQuery, parentValues);
            const parent_id = parentResult.insertId;

            // 4a. Link student to parent in student_parents table
            const studentParentQuery = `
                INSERT INTO student_parents (student_id, parent_id, is_primary)
                VALUES (?, ?, 1)
            `;
            await connection.query(studentParentQuery, [user_id, parent_id]);

            // 4b. Insert parent address into parent_addresses table
            if (address_lineP || cityP || provinceP || postal_codeP || countryP) {
                const parentAddressQuery = `
                    INSERT INTO parent_addresses (
                        parent_id, address_line_1, city, province, postal_code, country, address_type_id
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                `;

                const parentAddressValues = [
                    parent_id,
                    address_lineP || null,
                    cityP || null,
                    provinceP || null,
                    postal_codeP || null,
                    countryP || null,
                    address_type_idP || 1,
                ];

                await connection.query(parentAddressQuery, parentAddressValues);
            }
        }

        // 5. Insert school info into the 'schools' table
        if (name || school_phone || centre_no) {
            const schoolQuery = `
                INSERT INTO schools (
                    name, centre_no, school_phone, school_city
                ) VALUES (?, ?, ?, ?)
            `;

            const schoolValues = [
                name,
                centre_no,
                school_phone || null,
                school_city || null
            ];

            const [schoolResult]: any = await connection.query(schoolQuery, schoolValues);
            const school_id = schoolResult.insertId;

            // 5a. Link student to school in student_schools table
            const studentSchoolQuery = `
                INSERT INTO student_schools (user_id, school_id)
                VALUES (?, ?)
            `;
            await connection.query(studentSchoolQuery, [user_id, school_id]);
        }

        // 6. Insert interested courses into student_courses table
        if (interested_courses && Array.isArray(interested_courses) && interested_courses.length > 0) {
            const courseQuery = `
                INSERT INTO student_courses (student_id, course_id, status)
                VALUES (?, ?, 'Active')
            `;

            for (const courseId of interested_courses) {
                await connection.query(courseQuery, [user_id, courseId]);
            }
        }

        // --- Transaction Commit ---
        await connection.commit();

        // 7. Send email notifications (non-blocking - don't wait for email to complete)
        const emailPromises = [];

        // Send welcome email to student
        emailPromises.push(
            fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/emails/send-welcome`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: email,
                    studentName: `${first_name} ${last_name}`,
                }),
            }).catch(err => console.error('Welcome email failed:', err))
        );

        // Get course names for admin email
        const courseNames: string[] = [];
        if (interested_courses && Array.isArray(interested_courses)) {
            const [coursesData] = await pool.query<any[]>(
                'SELECT name FROM courses WHERE id IN (?)',
                [interested_courses]
            );
            courseNames.push(...coursesData.map((c: any) => c.name));
        }

        // Send notification to admin
        emailPromises.push(
            fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/emails/send-admin-notification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    student: {
                        firstName: first_name,
                        lastName: last_name,
                        email: email,
                        idNumber: identity_reference,
                        phone: phone || 'Not provided',
                        gender: data.gender || 'Not specified',
                        nationality: nationality || 'Not specified',
                    },
                    school: {
                        name: name || 'Not provided',
                        centreNo: centre_no || 'Not provided',
                        city: school_city || 'Not provided',
                    },
                    courses: courseNames.length > 0 ? courseNames : ['No courses selected'],
                    parent: {
                        firstName: first_nameP || 'Not provided',
                        lastName: last_nameP || 'Not provided',
                        phone: phoneP || 'Not provided',
                        relationship: relationshipP || 'Not specified',
                    },
                    documents: {
                        idDocument: idDocument || null,
                        matricDocument: matricDocument || null,
                    },
                }),
            }).catch(err => console.error('Admin notification failed:', err))
        );

        // Send emails in background (don't wait)
        Promise.all(emailPromises)
            .then(() => console.log('✅ Registration emails sent successfully'))
            .catch(err => console.error('❌ Some emails failed to send:', err));

        // --- Success Response ---
        return NextResponse.json(
            {
                success: true,
                message: 'User, Address, and Contact records created successfully.',
                user: { id: user_id, first_name, last_name, username, email, role_id },
            },
            { status: 201 }
        );
    } catch (error: any) {
        // --- Transaction Rollback ---
        if (connection) {
            try {
                await connection.rollback();
                console.error('Transaction rolled back due to error.');
            } catch (rollbackError) {
                console.error('Error during transaction rollback:', rollbackError);
            }
        }

        console.error('Registration error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Internal server error',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined,
            },
            { status: 500 }
        );
    } finally {
        // --- Release Connection ---
        if (connection) {
            connection.release();
        }
    }
}