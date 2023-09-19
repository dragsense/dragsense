import { database } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import nodemailer from 'nodemailer';

// Create a handler with next-connect
const handler = nc(ncOpts);

// Use the database middleware
handler.use(database);

// Handle OPTIONS request
handler.options(async (req, res) => {
  return res.status(200).json({});
});

// Function to create email body
const createEmailBody = ({ name, email, subject, message }) => {
  return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
    </head>
    <body>
      <p>Name: ${name}</p>
      <p>Email: ${email}</p>
      <p>Subject: ${subject}</p>
      <p>Message: ${message}</p>
      <!-- Add other HTML content here -->
    </body>
    </html>`;
};

// Function to create transporter
const createTransporter = ({ emailUser, emailPass, host, port }) => {
  return nodemailer.createTransport({
    host: host, 
    port: port, 
    secure: false, 
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
};

// Handle POST request
handler.post(async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  const emailBody = createEmailBody({ name, email, subject, message });

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT;

  try {
    const transporter = createTransporter({ emailUser, emailPass, host, port });

    await transporter.sendMail({
      from: emailUser,
      to: emailUser,
      port: 587,
      subject: subject,
      html: emailBody,
    });


    res.json({ status: true });

  } catch (e) {
    console.error(e?.message);

    return res.status(500)
      .json({ error: { message: 'Something Went Wrong.' } });
  }
});

export default handler;
