import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Log SMTP config (for debugging)
    console.log('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      passExists: !!process.env.SMTP_PASS,
    });

    // Remove spaces from app password (Gmail app passwords have spaces)
    const smtpPass = process.env.SMTP_PASS?.replace(/\s/g, '') || '';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465');

    // Create transporter with SSL for port 465
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: smtpPass,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000,
    });

    // Verify connection
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('SMTP connection verified');

    // Email to support
    const mailOptions = {
      from: `"KN Matric Excellence Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL_TO || 'support@knmatricexcellence.co.za',
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 20px;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 20px;
              border: 1px solid #ddd;
              border-top: none;
              border-radius: 0 0 8px 8px;
            }
            .field {
              margin-bottom: 15px;
              padding: 10px;
              background: white;
              border-left: 4px solid #667eea;
            }
            .label {
              font-weight: bold;
              color: #667eea;
              margin-bottom: 5px;
            }
            .message-box {
              background: white;
              padding: 15px;
              border-radius: 5px;
              border: 1px solid #ddd;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">New Contact Form Message</h2>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">From KN Matric Excellence Website</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div>${name}</div>
              </div>

              <div class="field">
                <div class="label">Email:</div>
                <div><a href="mailto:${email}">${email}</a></div>
              </div>

              <div class="field">
                <div class="label">Phone:</div>
                <div>${phone || 'Not provided'}</div>
              </div>

              <div class="field">
                <div class="label">Subject:</div>
                <div>${subject}</div>
              </div>

              <div class="field">
                <div class="label">Message:</div>
                <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
              </div>

              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
                <p>This email was sent from the contact form on the KN Matric Excellence website.</p>
                <p>To reply, simply respond to this email or use the email address provided above.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send email
    console.log('Sending email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error sending email:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
    });
    return NextResponse.json(
      {
        error: 'Failed to send email',
        details: error.message,
        code: error.code
      },
      { status: 500 }
    );
  }
}
