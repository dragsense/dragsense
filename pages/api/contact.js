import { database } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';

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



    try {
       await transporter.sendMail({
            from: 'info@autocode.com',
            from: 'info@autocode.com',
            subject: subject,
            html: emailBody
        });


        res.json({ status: true });

    } catch (e) {

        return res.status(403)
            .json({ error: { message: 'Something Went Wrong.' } });
    }

});

export default handler;
