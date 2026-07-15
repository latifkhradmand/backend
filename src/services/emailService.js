const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendVerificationEmail = async (email, code) => {
  // If no password is provided, or if it's still the placeholder, skip email and log to console
  if (
    !process.env.SMTP_PASS ||
    process.env.SMTP_PASS === "your_16_digit_app_password" ||
    process.env.SMTP_PASS.length < 16
  ) {
    console.log("\n==================================================");
    console.log(`📧 DEV MODE: Verification Code for ${email}`);
    console.log(`🔑 YOUR CODE IS: ${code}`);
    console.log("==================================================\n");
    return; // Skip actual email sending
  }

  try {
    await transporter.sendMail({
      from: `"Ausbildung Portal" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify Your Email - Ausbildung Portal",
      html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border-top: 4px solid #10b981;">
                        <h2 style="color: #333;">Email Verification</h2>
                        <p>Hello,</p>
                        <p>Please use the following verification code to complete your registration:</p>
                        <div style="background-color: #10b981; color: white; font-size: 24px; font-weight: bold; padding: 15px; text-align: center; border-radius: 6px; margin: 20px 0; letter-spacing: 2px;">
                            ${code}
                        </div>
                        <p style="color: #666; font-size: 14px;">This code will expire in 15 minutes.</p>
                    </div>
                </div>
            `,
    });
    console.log(`✅ Verification email successfully sent to ${email}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
    // Fallback: Print to console anyway so the user isn't blocked during testing
    console.log(`\n🔑 FALLBACK CODE for ${email}: ${code}\n`);
  }
};
