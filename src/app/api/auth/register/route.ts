import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { PoolConnection } from 'mysql2/promise';

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
            parent
        } = data;

        const { phone, email, tel_no } = contact || {};
        const { name, centre_no, school_phone, subjects ,school_city } = school || {};
        const { address_line_1, city, postal_code, province, country, address_type_id } = address || {};
        const { first_nameP,last_nameP, genderP, identity_referenceP,identity_type_idP, nationalityP, phoneP, relationshipP, occupationP, address_lineP, cityP, provinceP, postal_codeP, countryP, address_type_idP} = parent || {};

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
            INSERT INTO users ( first_name, last_name, username, password, interested_courses, nationality, user_type, role_id, identity_type_id, identity_reference, is_active, status_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1)
        `;

        const userValues = [
            first_name, last_name, username, hashedPassword,
            JSON.stringify(interested_courses),
            nationality || null,
            user_type || 2,
            role_id || 4,
            identity_type_id || 1,
            identity_reference,
        ];

        const [userResult]: any = await connection.query(userQuery, userValues);
        const user_id = userResult.insertId;

        // 2. Insert address into the 'address' table
        if (address_line_1 || city || province || postal_code || country) {
            const addressQuery = `
                INSERT INTO address (
                    user_id, address_line_1, city, province, postal_code, address_type_id, country
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            const addressValues = [
                user_id,
                address_line_1 || null,
                city || null,
                province || null,
                postal_code || null,
                address_type_id,
                country || null,
            ];

            await connection.query(addressQuery, addressValues);
        }

        // 3. Insert contact info into the 'contact' table
        if (phone || email) {
            const contactQuery = `
                INSERT INTO contact (
                    user_id, name, mail_address, cell_no, tel_no
                ) VALUES (?, ?, ?, ?, ?)
            `;

            const contactName = `${first_name} ${last_name}`;

            const contactValues = [
                user_id,
                contactName,
                email,
                phone || null,
                tel_no || null
            ];

            await connection.query(contactQuery, contactValues);
        }

        // 2. Insert parent details into the 'parent table' table
        if (first_nameP || last_nameP || identity_referenceP || phoneP || address_lineP) {
            const parentQuery = `
                INSERT INTO parents (
                    user_id, first_name, last_name, gender ,phone, relationship, occupation, nationality, identity_type_id, identity_reference, address_type_id, address_line_1, city, province, postal_code, country
                   ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const parentValues = [
                user_id,
                first_nameP,
                last_nameP,
                genderP,
                phoneP,
                relationshipP || null,
                occupationP || null,
                nationalityP || null,
                identity_type_idP || 1,
                identity_referenceP,
                address_type_idP || 1,
                address_lineP || null,
                cityP || null,
                provinceP || null,
                postal_codeP || null,
                countryP || null,
            ];

            await connection.query(parentQuery, parentValues);
        }

        // 3. Insert school info into the 'school' table
        //name, centre_no, school_phone, subjects ,school_city
        if (name || school_phone || centre_no) {
            const schoolQuery = `
                INSERT INTO school (
                    user_id, name, centre_no, phone ,city
                ) VALUES (?, ?, ?, ?, ?)
            `;

            const schoolValues = [
                user_id,
                name,
                centre_no,
                school_phone || null,
                school_city || null
            ];

            await connection.query(schoolQuery, schoolValues);
        }

        // --- Transaction Commit ---
        await connection.commit();

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