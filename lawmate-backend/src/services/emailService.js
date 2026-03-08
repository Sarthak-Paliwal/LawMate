const nodemailer = require('nodemailer');

/**
 * Configure Nodemailer transport.
 * Note: Provide valid SMTP credentials in the .env file.
 */
const getTransport = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT || 587,
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });
};

/**
 * Setup a test account dynamically if credentials are missing
 * (Useful for development without a real SMTP server configured).
 */
const ensureTestAccount = async () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    try {
      const testAccount = await nodemailer.createTestAccount();
      process.env.EMAIL_HOST = 'smtp.ethereal.email';
      process.env.EMAIL_PORT = 587;
      process.env.EMAIL_USER = testAccount.user;
      process.env.EMAIL_PASS = testAccount.pass;
      console.log('--- Development Email Setup ---');
      console.log('No EMAIL_USER or EMAIL_PASS found in .env. Using Ethereal Test Account.');
      console.log(`User: ${testAccount.user}`);
      console.log(`Pass: ${testAccount.pass}`);
    } catch (e) {
      console.error('Failed to create Ethereal test account:', e);
    }
  }
};

/**
 * Send an OTP Email to the newly registered user.
 * @param {string} email 
 * @param {string} otp - 6 digit string
 */
exports.sendVerificationOTP = async (email, otp) => {
  try {
    await ensureTestAccount();
    const transporter = getTransport();

    const mailOptions = {
      from: `"LawMate" <${process.env.EMAIL_FROM || 'noreply@lawmate.com'}>`,
      to: email,
      subject: 'Verify your LawMate Account - ' + otp,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #4f46e5; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">Welcome to LawMate!</h1>
          </div>
          <div style="padding: 30px; background-color: #fafafa; color: #333;">
            <p style="font-size: 16px;">Hello,</p>
            <p style="font-size: 16px;">Thank you for registering. To complete your account creation, please verify your email address by entering the 6-digit code below:</p>
            
            <div style="margin: 30px 0; text-align: center;">
              <span style="font-size: 36px; font-weight: bold; letter-spacing: 5px; color: #4f46e5; background-color: #e0e7ff; padding: 15px 25px; border-radius: 8px;">${otp}</span>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
          </div>
          <div style="background-color: #1e293b; padding: 15px; text-align: center; color: #94a3b8; font-size: 12px;">
            &copy; ${new Date().getFullYear()} LawMate. All rights reserved.
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}. Message ID: ${info.messageId}`);
    
    // If using Ethereal in development, print the preview URL
    if (info.messageId && process.env.EMAIL_HOST === 'smtp.ethereal.email') {
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }

    return true;
  } catch (err) {
    console.error('Error sending OTP email:', err);
    throw new Error('Failed to send verification email.');
  }
};
