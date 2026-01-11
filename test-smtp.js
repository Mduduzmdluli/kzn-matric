// Test SMTP connection
require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

async function testSMTP() {
  console.log('🧪 Testing SMTP Connection...\n');
  console.log('Configuration:');
  console.log('  Host:', process.env.SMTP_HOST);
  console.log('  Port:', process.env.SMTP_PORT);
  console.log('  User:', process.env.SMTP_USER);
  console.log('  Pass:', process.env.SMTP_PASS ? '****' + process.env.SMTP_PASS.slice(-4) : 'NOT SET');
  console.log('\n');

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log('⏳ Verifying SMTP connection...');

    // Verify connection
    await transporter.verify();

    console.log('✅ SMTP connection successful!\n');
    console.log('📧 Sending test email...');

    // Send test email
    const info = await transporter.sendMail({
      from: `"KZN Matric Excellence Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Send to yourself
      subject: 'Test Email from KZN Matric Excellence',
      text: 'This is a test email. If you received this, your SMTP configuration is working!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #667eea;">✅ SMTP Test Successful!</h2>
          <p>Your email configuration is working correctly.</p>
          <p><strong>Configuration:</strong></p>
          <ul>
            <li>Host: ${process.env.SMTP_HOST}</li>
            <li>Port: ${process.env.SMTP_PORT}</li>
            <li>User: ${process.env.SMTP_USER}</li>
          </ul>
          <p>You can now use the registration system to send emails automatically.</p>
        </div>
      `,
    });

    console.log('✅ Test email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log('   Check your inbox:', process.env.SMTP_USER);
    console.log('\n🎉 SMTP is configured correctly!');

  } catch (error) {
    console.error('\n❌ SMTP Test Failed!\n');
    console.error('Error:', error.message);
    console.error('\n');

    if (error.code === 'EAUTH') {
      console.error('🔑 Authentication Failed!');
      console.error('\n📋 For Gmail, you MUST use an App Password:');
      console.error('   1. Enable 2-Step Verification: https://myaccount.google.com/security');
      console.error('   2. Create App Password: https://myaccount.google.com/apppasswords');
      console.error('   3. Update SMTP_PASS in .env.local with the 16-character app password');
      console.error('\n💡 The password format should be: xxxx xxxx xxxx xxxx');
      console.error('   (Example: abcd efgh ijkl mnop)\n');
    } else if (error.code === 'ESOCKET') {
      console.error('🔌 Connection Failed!');
      console.error('   Check your SMTP_HOST and SMTP_PORT settings');
    } else {
      console.error('Full error:', error);
    }
  }
}

testSMTP();
