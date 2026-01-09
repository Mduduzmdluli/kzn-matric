// This API route is not compatible with static export
// It requires server-side functionality for authentication and database access
// For static export, authentication should be handled client-side with external APIs

import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json(
        { error: 'This endpoint requires a server environment' },
        { status: 501 }
    );
}