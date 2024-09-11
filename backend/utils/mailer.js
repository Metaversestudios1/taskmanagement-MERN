const nodemailer = require('nodemailer');

// Set up Nodemailer transport
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use your email service provider
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS  // Your email password
  }
});

const sendEmailWithAttachment = async (to, subject, text, pdfBuffer, filename) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to: to, // Recipient address
    subject: subject, // Email subject
    text: text, // Plain text body
    attachments: [
      {
        filename: filename, // The name of the PDF file
        content: pdfBuffer, // The PDF content as a buffer
        encoding: 'base64' // Encode buffer in base64
      }
    ]
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(error);
      }
      resolve(info);
    });
  });
};

module.exports = { sendEmailWithAttachment };