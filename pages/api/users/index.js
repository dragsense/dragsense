import { ValidateProps } from "@/api-helper/constants";
import {
  findUsers,
  findUserByEmail,
  updateUserById,
  insertUser,
  deleteUserById,
} from "@/api-helper/database";
import { database, authorize, validateBody } from "@/api-helper/middlewares";
import { ncOpts } from "@/api-helper/nc";
import { slugUsername } from "@/lib/utils";
import nc from "next-connect";
import isEmail from "validator/lib/isEmail";
import normalizeEmail from "validator/lib/normalizeEmail";
import { createTransport } from "nodemailer";
import jwt from "jsonwebtoken";

// Initialize next-connect with options
const handler = nc(ncOpts);

// Use database middleware
handler.use(database);

// Function to handle GET requests
handler.get(authorize, async (req, res) => {


  if (!req.user) {
    return res.status(401).json({ error: { message: "Unauthorized access." } });
  }

  if (req.user.email !== process.env.ADMIN) {
    return res.status(401).json({ error: { message: "Unauthorized access." } });
  }

  // Fetch users from the database
  const users = await findUsers(
    req.db,
    null,
    req.query.page ? parseInt(req.query.page, 10) : 0,
    req.query.limit ? parseInt(req.query.limit, 10) : 10
  );

  // Send the fetched users as a response
  res.json(users);
});

// Function to handle POST requests
handler.post(
  validateBody({
    type: "object",
    properties: {
      email: ValidateProps.user.email,
      name: ValidateProps.user.name,
      password: ValidateProps.user.password,
    },
    required: ["name", "password", "email"],
    additionalProperties: false,
  }),
  async (req, res) => {
    let { name, email, password } = req.body;

    email = normalizeEmail(req.body.email);

    // Check if the email is valid
    if (!isEmail(email)) {
      res
        .status(400)
        .json({ error: { message: "The email you entered is invalid." } });
      return;
    }
    // Check if the email is already in use
    if (await findUserByEmail(req.db, email)) {
      res
        .status(403)
        .json({ error: { message: "The email has already been used." } });
      return;
    }

    let userId = null;

    try {
      // Insert the new user into the database
      const createdUser = await insertUser(req.db, {
        email,
        originalPassword: password,
        name,
        emailVerified: null,
      });

      userId = createdUser._id;
      // Generate a JWT token for the user
      const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
        expiresIn: "30m",
      });
      const url = process.env.NEXTAUTH_URL + `/auth/user-verify?token=${token}`;

      // Create a transport for sending email
      const transport = createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_HOST_PORT), // Ensure port is parsed as an integer
        secure: process.env.EMAIL_HOST_SECURE === "true",
        auth: {
          user: process.env.EMAIL_HOST_USER,
          pass: process.env.EMAIL_HOST_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      // Send the verification email
      const result = await transport.sendMail({
        to: email,
        from: `"DragSense" <${process.env.EMAIL}>`,
        subject: `Email Verification - DragSense`,
        html: `
          <p>Hi ${name},</p>
          <p>Thank you for registering with DragSense. To complete the registration process, please click the link below to verify your email address:</p>
          <p><a href="${url}">${url}</a></p>
          <p>If you did not sign up for an account on our website, you can safely ignore this email.</p>
        `,
      });

      // Check if the email was sent successfully
      const failed = result.rejected.concat(result.pending).filter(Boolean);

      if (failed.length) {
        if (userId) await deleteUserById(req.db, userId);
        res
          .status(403)
          .json({
            error: {
              message: `Email(s) (${failed.join(
                ", "
              )}) could not be sent, user creation rolled back.`,
            },
          });
        return;
      }

      res.status(201).json({ success: true });
    } catch (e) {
      // Attempt to delete the user if created and email sending failed
      if (userId) {
        await deleteUserById(req.db, userId);
      }
      res
        .status(500)
        .json({ error: { message: `User creation failed: ${e.message}` } });
    }
  }
);

// Function to handle PATCH requests
handler.patch(
  authorize,
  validateBody({
    type: "object",
    properties: {
      name: ValidateProps.user.name,
      email: ValidateProps.user.email,
    },
    required: ["name", "email"],
    additionalProperties: true,
  }),
  async (req, res) => {
    let {
      name,
      email,
      isEmailPublic,
      bio,
      image,
      enable2FA = false,
    } = req.body;

    // Find the user by email
    const user = await findUserByEmail(req.db, req.user.email);

    // Check if the user exists
    if (!user) {
      res.status(403).json({ error: { message: "User Not Found." } });
      return;
    }

    // Check if the email is already in use
    if (req.user.email !== email && (await findUserByEmail(req.db, email))) {
      res
        .status(403)
        .json({ error: { message: "The email has already been used." } });
      return;
    }

    // Update the user in the database
    await updateUserById(req.db, user._id, {
      name,
      enable2FA,
      email,
      isEmailPublic,
      bio,
      image,
    });

    res.status(201).json({ success: true });
  }
);

export default handler;
