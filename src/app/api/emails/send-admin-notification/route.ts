import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { student, school, courses, parent, documents } = data;

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Format courses list
    const coursesList = courses.join(', ');

    // Email subject
    const subject = `Online - ${student.firstName} ${student.lastName} - ${student.idNumber}`;

    // Prepare attachments
    const attachments = [];
    if (documents.idDocument) {
      // Extract base64 data (remove data:mime/type;base64, prefix)
      const base64Data = documents.idDocument.data.split(',')[1];
      attachments.push({
        filename: documents.idDocument.name,
        content: base64Data,
        encoding: 'base64',
        contentType: documents.idDocument.type
      });
    }
    if (documents.matricDocument) {
      const base64Data = documents.matricDocument.data.split(',')[1];
      attachments.push({
        filename: documents.matricDocument.name,
        content: base64Data,
        encoding: 'base64',
        contentType: documents.matricDocument.type
      });
    }

    // Email content
    const mailOptions: any = {
      from: `"KZN Matric Excellence Registration" <${process.env.SMTP_USER}>`,
      to: 'admin@matricexcellence.co.za',
      subject: subject,
      attachments: attachments,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .section { background: #f9f9f9; margin: 20px 0; padding: 20px; border-left: 4px solid #2563eb; }
            .section h2 { margin-top: 0; color: #2563eb; }
            table { width: 100%; border-collapse: collapse; }
            td { padding: 8px; border-bottom: 1px solid #ddd; }
            td:first-child { font-weight: bold; width: 200px; }
            .documents { background: #fff3cd; padding: 15px; margin: 20px 0; border-left: 4px solid #ffc107; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 New Student Registration</h1>
              <p>A new student has registered online</p>
            </div>

            <div class="section">
              <h2>👤 Student Information</h2>
              <table>
                <tr>
                  <td>Full Name:</td>
                  <td>${student.firstName} ${student.lastName}</td>
                </tr>
                <tr>
                  <td>ID Number:</td>
                  <td><strong>${student.idNumber}</strong></td>
                </tr>
                <tr>
                  <td>Email:</td>
                  <td>${student.email}</td>
                </tr>
                <tr>
                  <td>Phone:</td>
                  <td>${student.phone}</td>
                </tr>
                <tr>
                  <td>Gender:</td>
                  <td>${student.gender}</td>
                </tr>
                <tr>
                  <td>Nationality:</td>
                  <td>${student.nationality}</td>
                </tr>
              </table>
            </div>

            <div class="section">
              <h2>🏫 School Information</h2>
              <table>
                <tr>
                  <td>School Name:</td>
                  <td>${school.name}</td>
                </tr>
                <tr>
                  <td>Centre Number:</td>
                  <td>${school.centreNo}</td>
                </tr>
                <tr>
                  <td>City:</td>
                  <td>${school.city}</td>
                </tr>
              </table>
            </div>

            <div class="section">
              <h2>📚 Interested Courses</h2>
              <p><strong>${coursesList}</strong></p>
            </div>

            <div class="section">
              <h2>👨‍👩‍👧 Parent/Guardian Information</h2>
              <table>
                <tr>
                  <td>Full Name:</td>
                  <td>${parent.firstName} ${parent.lastName}</td>
                </tr>
                <tr>
                  <td>Relationship:</td>
                  <td>${parent.relationship}</td>
                </tr>
                <tr>
                  <td>Phone:</td>
                  <td>${parent.phone}</td>
                </tr>
              </table>
            </div>

            <div class="documents">
              <h2>📎 Document Attachments</h2>
              <p><strong>📧 Attached to this email:</strong></p>
              <ul>
                <li><strong>ID Document:</strong> ${documents.idDocument ? `✓ ${documents.idDocument.name} (attached)` : '❌ Not provided'}</li>
                <li><strong>Matric Certificate:</strong> ${documents.matricDocument ? `✓ ${documents.matricDocument.name} (attached)` : '❌ Not provided'}</li>
              </ul>
              ${!documents.idDocument || !documents.matricDocument ? `<p><em>⚠️ Contact student at ${student.email} or ${student.phone} for missing documents.</em></p>` : '<p><em>✅ All documents attached - please review below.</em></p>'}
            </div>

            <div class="footer">
              <p><strong>Action Required:</strong></p>
              <p>Please review this registration and approve or contact the student if additional information is needed.</p>
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
              <p style="font-size: 12px; color: #999;">
                This is an automated notification from the KZN Matric Excellence registration system.<br>
                Registration received at: ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        NEW STUDENT REGISTRATION
        ========================

        STUDENT INFORMATION
        -------------------
        Full Name: ${student.firstName} ${student.lastName}
        ID Number: ${student.idNumber}
        Email: ${student.email}
        Phone: ${student.phone}
        Gender: ${student.gender}
        Nationality: ${student.nationality}

        SCHOOL INFORMATION
        ------------------
        School Name: ${school.name}
        Centre Number: ${school.centreNo}
        City: ${school.city}

        INTERESTED COURSES
        ------------------
        ${coursesList}

        PARENT/GUARDIAN INFORMATION
        ---------------------------
        Full Name: ${parent.firstName} ${parent.lastName}
        Relationship: ${parent.relationship}
        Phone: ${parent.phone}

        DOCUMENT ATTACHMENTS
        --------------------
        ID Document: ${documents.idDocument ? `✓ ${documents.idDocument.name} (attached)` : '❌ Not provided'}
        Matric Certificate: ${documents.matricDocument ? `✓ ${documents.matricDocument.name} (attached)` : '❌ Not provided'}

        ${!documents.idDocument || !documents.matricDocument ? `ACTION REQUIRED: Contact student at ${student.email} or ${student.phone} for missing documents.` : '✓ All documents attached to this email.'}

        Registration received at: ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: 'Admin notification sent successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error sending admin notification:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
