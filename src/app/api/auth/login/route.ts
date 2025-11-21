import { NextRequest } from 'next/server';
import { adminLogin } from '@/app/controllers/authController';

/**
 * POST /api/auth/login
 * Admin login endpoint
 */
export async function POST(req: NextRequest) {
  return await adminLogin(req);
}