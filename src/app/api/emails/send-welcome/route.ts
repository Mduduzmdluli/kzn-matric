import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { to, studentName } = await request.json();

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"KZN Matric Excellence" <${process.env.SMTP_USER}>`,
      to: to,
      subject: 'Welcome to KZN Matric Excellence! 🎓',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .highlight { background: #fff; padding: 15px; border-left: 4px solid #f97316; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Welcome to KZN Matric Excellence!</h1>
            </div>
            <div class="content">
              <p>Dear ${studentName},</p>

              <p>Congratulations! You have successfully registered with KZN Matric Excellence.</p>

              <div class="highlight">
                <strong>What happens next?</strong>
                <ul>
                  <li>Our team is reviewing your application</li>
                  <li>You will receive a confirmation email within 24-48 hours</li>
                  <li>Once approved, you'll get access to your student portal</li>
                  <li>Course materials and schedules will be provided</li>
                </ul>
              </div>

              <p><strong>Important Information:</strong></p>
              <ul>
                <li>Keep your login credentials safe</li>
                <li>Check your email regularly for updates</li>
                <li>Contact us if you have any questions</li>
              </ul>

              <p>We're excited to help you achieve your matric excellence goals!</p>

              <p>Best regards,<br>
              <strong>The KZN Matric Excellence Team</strong></p>
            </div>
            <div class="footer">
              <p>📧 Email: info@matricexcellence.co.za<br>
              📱 Phone: +27 84 325 9834<br>
              🌐 Website: <a href="https://www.matricexcellence.co.za">www.matricexcellence.co.za</a></p>
              <p style="font-size: 12px; color: #999;">
                This is an automated message. Please do not reply to this email.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Dear ${studentName},

        Congratulations! You have successfully registered with KZN Matric Excellence.

        What happens next?
        - Our team is reviewing your application
        - You will receive a confirmation email within 24-48 hours
        - Once approved, you'll get access to your student portal
        - Course materials and schedules will be provided

        Important Information:
        - Keep your login credentials safe
        - Check your email regularly for updates
        - Contact us if you have any questions

        We're excited to help you achieve your matric excellence goals!

        Best regards,
        The KZN Matric Excellence Team

        Email: info@matricexcellence.co.za
        Phone: +27 84 325 9834
        Website: www.matricexcellence.co.za
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: 'Welcome email sent successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error sending welcome email:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
