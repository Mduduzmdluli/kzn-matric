import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const idDocument = formData.get('idDocument') as File | null;
        const matricDocument = formData.get('matricDocument') as File | null;
        const studentName = formData.get('studentName') as string;
        const idNumber = formData.get('idNumber') as string;

        // Validate files
        if (!idDocument || !matricDocument) {
            return NextResponse.json(
                { success: false, error: 'Both ID and matric documents are required' },
                { status: 400 }
            );
        }

        // Validate file types
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

        if (!allowedTypes.includes(idDocument.type)) {
            return NextResponse.json(
                { success: false, error: 'ID document must be PDF, JPG, or PNG' },
                { status: 400 }
            );
        }

        if (!allowedTypes.includes(matricDocument.type)) {
            return NextResponse.json(
                { success: false, error: 'Matric document must be PDF, JPG, or PNG' },
                { status: 400 }
            );
        }

        // Validate file sizes (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (idDocument.size > maxSize) {
            return NextResponse.json(
                { success: false, error: 'ID document must be less than 5MB' },
                { status: 400 }
            );
        }

        if (matricDocument.size > maxSize) {
            return NextResponse.json(
                { success: false, error: 'Matric document must be less than 5MB' },
                { status: 400 }
            );
        }

        // Create upload directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'documents');
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Generate unique filenames
        const timestamp = Date.now();
        const sanitizedName = studentName.replace(/[^a-zA-Z0-9_]/g, '_');
        const sanitizedId = idNumber.replace(/[^a-zA-Z0-9]/g, '');

        const idDocExt = idDocument.name.split('.').pop();
        const matricDocExt = matricDocument.name.split('.').pop();

        const idDocFilename = `${sanitizedName}_${sanitizedId}_ID_${timestamp}.${idDocExt}`;
        const matricDocFilename = `${sanitizedName}_${sanitizedId}_MATRIC_${timestamp}.${matricDocExt}`;

        // Convert files to buffers and save
        const idDocBytes = await idDocument.arrayBuffer();
        const idDocBuffer = Buffer.from(idDocBytes);

        const matricDocBytes = await matricDocument.arrayBuffer();
        const matricDocBuffer = Buffer.from(matricDocBytes);

        const idDocPath = path.join(uploadDir, idDocFilename);
        const matricDocPath = path.join(uploadDir, matricDocFilename);

        await writeFile(idDocPath, idDocBuffer);
        await writeFile(matricDocPath, matricDocBuffer);

        // Return the URLs (relative to public folder)
        const idDocumentUrl = `/uploads/documents/${idDocFilename}`;
        const matricDocumentUrl = `/uploads/documents/${matricDocFilename}`;

        return NextResponse.json(
            {
                success: true,
                message: 'Documents uploaded successfully',
                idDocumentUrl,
                matricDocumentUrl,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to upload documents',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined,
            },
            { status: 500 }
        );
    }
}
