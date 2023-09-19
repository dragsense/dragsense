import { ValidateProps } from '@/api-helper/constants';
import {
  _findProjectById, findRolesByProjectRoles, updateRoleInUserById,
  findRoleByUserIdAndProejectId, findUserByEmail,
  updateRoleInProjectById, insertRole
} from '@/api-helper/database';
import { authorize, database, validateBody } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';

// Initialize next-connect with options
const handler = nc(ncOpts);
handler.use(database, authorize);

// Function to handle GET requests
const handleGet = async (req, res) => {
  const project = await _findProjectById(req.db, req.query.projectId);

  if (!project) {
    return res.status(403).json({ error: { message: 'Project Not Found.' } });
  }

  try {
    const results = await findRolesByProjectRoles(
      req.db,
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

// Function to handle POST requests
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
    const role = await insertRole(req.db, { userId: user._id, projectId: project._id, name: roleName, permissions });
    await updateRoleInProjectById(req.db, project._id, role._id);
    await updateRoleInUserById(req.db, user._id, role._id);

    role['user'] = user;
    return res.json({role});
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