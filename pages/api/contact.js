import { database } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import nodemailer from 'nodemailer';

const handler = nc(ncOpts);

handler.use(database);
handler.options(async (req, res) => {
  return res.status(200).json({});

});

handler.post(async (req, res, next) => {

  const { name, email, subject, message } = req.body


  const emailBody = `<!DOCTYPE html>
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

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT;

  try {

    const transporter = nodemailer.createTransport({
      host: host, 
      port: port, 
      secure: false, 
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    await transporter.sendMail({
      from: emailUser,
      to: emailUser,
      port: 587,
      subject: subject,
      html: emailBody,
   
    });

    console.log(emailBody)

    res.json({ status: true });

  } catch (e) {
    console.log(e?.message)

    return res.status(403)
      .json({ error: { message: 'Something Went Wrong.' } });
  }

});

export default handler;
