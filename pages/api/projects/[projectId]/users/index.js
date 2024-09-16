import { ValidateProps } from '@/api-helper/constants';
import {
  _findProjectById, findRolesByProjectRoles, updateRoleInUserById,
  findRoleByUserIdAndProejectId, findUserByEmail,
  updateRoleInProjectById, insertRole
} from '@/api-helper/database';
import { authorize, database, validateBody } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import { createTransport } from "nodemailer";
import jwt from 'jsonwebtoken';

// Initialize next-connect with options
const handler = nc(ncOpts);
handler.use(database, authorize);

// Handle GET requests
const handleGet = async (req, res) => {
  const project = await _findProjectById(req.db, req.query.projectId);

  if (!project) {
    return res.status(403).json({ error: { message: 'Project Not Found.' } });
  }

  try {
    const results = await findRolesByProjectRoles(
      req.db,
      null,
      Array.isArray(project.roles) ? project.roles : [],
      req.query.page ? parseInt(req.query.page, 10) : 0,
      req.query.limit ? parseInt(req.query.limit, 10) : 10
    );

    return res.status(200).json(results);
  } catch (e) {
    res.status(500).json({ error: { message: 'Something went wrong.' } });
  }
};

handler.get(handleGet);

// Handle POST requests
const handlePost = async (req, res) => {
  const project = await _findProjectById(req.db, req.query.projectId);

  if (!project) {
    return res.status(403).json({ error: { message: 'Project Not Found.' } });
  }

  const { email, roleName, permissions } = req.body;
  const user = await findUserByEmail(req.db, email);

  if (!user) {
    res.status(403).json({ error: { message: 'User not found.' } });
    return;
  }

  if (user._id.equals(project.creatorId)) {
    res.status(403).json({ error: { message: "You can't add yourself." } });
    return;
  } 

  if (await findRoleByUserIdAndProejectId(req.db, project._id, user._id)) {
    res.status(403).json({ error: { message: 'User already added.' } });
    return;
  }

  try {
    // Generate a JWT token for the user
    const token = jwt.sign({ userId: user._id, projectId: project._id, roleName, permissions }, process.env.JWT_SECRET, {
      expiresIn: '30m',
    });

    const url = `${process.env.NEXTAUTH_URL}/projects/user-request?token=${token}`;

    // Create a transport for sending email
    const transport = createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_HOST_PORT),
      secure: process.env.EMAIL_HOST_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASS,
      },
    });

    // Send the verification email
    const result = await transport.sendMail({
      to: email,
      from: `"DragSense" <${process.env.EMAIL}>`,
      subject: `Project Role Request - ${project.name}`,
      html: `
        <p>Hi ${user.name || email},</p>
        <p>You have been invited to join the project <strong>${project.name}</strong> as a <strong>${roleName}</strong>.</p>
        <p>To confirm your role, please click the link below:</p>
        <p><a href="${url}">Accept Invitation</a></p>
        <p>If you did not expect this invitation, you can safely ignore this email.</p>
      `,
    });

    const failed = result.rejected.concat(result.pending).filter(Boolean);
    if (failed.length) {
      return res.status(403).json({ error: { message: `Failed to send email to ${failed.join(", ")}` } });
    }

    res.status(201).json({ success: true, message: 'Role request sent.' });
  } catch (e) {
    res.status(500).json({ error: { message: 'Something went wrong.' } });
  }
};

handler.post(
  validateBody({
    type: 'object',
    properties: {
      email: ValidateProps.user.email,
      roleName: ValidateProps.user.roleName,
      permissions: ValidateProps.user.permissions,
    },
    required: ['email', 'roleName', 'permissions'],
    additionalProperties: true,
  }),
  handlePost
);

export default handler;
