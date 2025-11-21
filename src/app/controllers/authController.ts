import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { User, UserResponse, LoginRequest } from '@/app/types/user';

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || '1884ad10ec928568b4120f7c98653a853db1210d3232ae1ad2c26764e7d9b168074820597b52be5c50ad4139b8934ccdb73e5307d3f419d4908ae247cec69a05';

/**
 * Admin Login Controller
 * Handles authentication for admin users
 */
export const adminLogin = async (req: NextRequest) => {
  let connection;
  
  try {
    // Parse request body
    const body: LoginRequest = await req.json();
    const { username, password } = body;

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Username and password are required' 
        },
        { status: 400 }
      );
    }

    // Get database connection
    connection = await pool.getConnection();

    // Query user by username
    const [rows] = await connection.execute<RowDataPacket[]>(
      `SELECT 
        id, first_name, last_name, username, password, 
        gender, nationality, user_type, role_id, 
        identity_type_id, is_active, status_id,
        created_at, updated_at
      FROM users 
      WHERE username = ? AND is_active = 1`,
      [username]
    );

    // Check if user exists
    if (rows.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid credentials' 
        },
        { status: 401 }
      );
    }

    const user = rows[0] as User;

    // Check if user is admin (assuming role_id 1 or 2 is admin)
    // Adjust this based on your role system
    if (user.role_id !== 1 && user.role_id !== 2) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Unauthorized: Admin access only' 
        },
        { status: 403 }
      );
    }

    // Check if account is active
    if (!user.is_active) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Account is inactive. Please contact administrator.' 
        },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid credentials' 
        },
        { status: 401 }
      );
    }

    // Prepare user data (exclude sensitive information)
    const userData: UserResponse = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      gender: user.gender,
      nationality: user.nationality,
      user_type: user.user_type,
      role_id: user.role_id,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        username: user.username,
        roleId: user.role_id,
        userType: user.user_type
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: userData,
        token,
      },
      { status: 200 }
    );

    // Set HTTP-only cookie for additional security
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;

  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
};

/**
 * Regular User Login Controller
 * Handles authentication for regular users
 */
export const userLogin = async (req: NextRequest) => {
  let connection;
  
  try {
    const body: LoginRequest = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Username and password are required' 
        },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();

    const [rows] = await connection.execute<RowDataPacket[]>(
      `SELECT 
        id, first_name, last_name, username, password, 
        gender, nationality, user_type, role_id, 
        is_active, status_id, created_at, updated_at
      FROM users 
      WHERE username = ? AND is_active = 1`,
      [username]
    );
    console.log('Rows fetched: ', rows);

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = rows[0] as User;

    if (!user.is_active) {
      return NextResponse.json(
        { success: false, message: 'Account is inactive' },
        { status: 403 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const userData: UserResponse = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      gender: user.gender,
      nationality: user.nationality,
      user_type: user.user_type,
      role_id: user.role_id,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    const token = jwt.sign(
      { 
        userId: user.id,
        username: user.username,
        roleId: user.role_id,
        userType: user.user_type
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: userData,
        token,
      },
      { status: 200 }
    );

    response.cookies.set('user-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;

  } catch (error: any) {
    console.error('User login error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
};