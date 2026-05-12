const nodemailer = require("nodemailer");

const sendResetEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `http://localhost:5173/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Password",
    html: `
      <h3>Reset Password</h3>
      <p>Bấm vào link dưới để đổi mật khẩu:</p>
      <a href="${resetLink}">${resetLink}</a>
    `,
  });
};

module.exports = sendResetEmail;