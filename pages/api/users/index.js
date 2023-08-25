import { ValidateProps } from '@/api-helper/constants';
import {
  findUsers,
  findUserByEmail,
  updateUserById,
  insertUser,
} from '@/api-helper/database';
import { database, authorize, validateBody } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import { slugUsername } from '@/lib/utils';
import nc from 'next-connect';
import isEmail from 'validator/lib/isEmail';
import normalizeEmail from 'validator/lib/normalizeEmail';
import { createTransport } from "nodemailer"
import jwt from 'jsonwebtoken'

const handler = nc(ncOpts);
handler.use(database);

handler.get(async (req, res) => {

  const users = await findUsers(
    req.db,
    req.query.page ? parseInt(req.query.page, 10) : 0,
    req.query.limit ? parseInt(req.query.limit, 10) : 10
  );

  res.json(users);
});

handler.post(
  validateBody({
    type: 'object',
    properties: {
      email: ValidateProps.user.email,
      name: ValidateProps.user.name,
      password: ValidateProps.user.password,
    },
    required: ['name', 'password', 'email'],
    additionalProperties: false,
  }),
  async (req, res) => {
    let { name, email, password } = req.body;

    email = normalizeEmail(req.body.email);

    if (!isEmail(email)) {
      res
        .status(400)
        .json({ error: { message: 'The email you entered is invalid.' } });
      return;
    }
    if (await findUserByEmail(req.db, email)) {
      res
        .status(403)
        .json({ error: { message: 'The email has already been used.' } });
      return;
    }

    const createdUser = await insertUser(req.db, {
      email,
      originalPassword: password,
      name,
      emailVerified: null
    });

    const token = jwt.sign({ _id: createdUser._id }, process.env.JWT_SECRET,
      {
        expiresIn: '30m'
      })
    const url = process.env.NEXTAUTH_URL + `/auth/user-verify?token=${token}`;
    const { host } = new URL(url)


    const transport = createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_HOST_PORT,
      auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD,
      }
    })
    const result = await transport.sendMail({
      to: email,
      from: process.env.EMAIL,
      subject: `Email Verification - ${process.env.NEXTAUTH_URL}`,
      html: `
      <p>Hi ${name},</p>

      <p>Thank you for registering with Autocode. To complete the registration process, please click the link below to verify your email address:</p>
      
      <p><a href="${url}">${url}</a></p>
      
      <p>If you did not sign up for an account on our website, you can safely ignore this email.</p>
      `,
    })
    const failed = result.rejected.concat(result.pending).filter(Boolean)

    if (failed.length) {
      res
        .status(403)
        .json({ error: { message: `Email(s) (${failed.join(", ")}) could not be sent` } });
      return;

    }


    res.status(201).json({ success: true });
  }
);


handler.patch(authorize,
  validateBody({
    type: 'object',
    properties: {
      name: ValidateProps.user.name,
    },
    required: ['name'],
    additionalProperties: true,
  }),
  async (req, res) => {
    let { name, theme = "dark", enable2FA = false } = req.body;

    const user = await findUserByEmail(req.db, req.user.email);

    if (!user)
      return res.status(401).end();

    if (!user) {
      res
        .status(403)
        .json({ error: { message: 'User Not Found.' } });
      return;
    }

    await updateUserById(req.db, user._id, {
      name,
      enable2FA,
      theme,
    });


    res.status(201).json({ success: true });
    ;
  }
);


export default handler;
