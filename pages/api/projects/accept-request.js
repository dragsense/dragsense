import { database } from '@/api-helper/middlewares';
import nc from 'next-connect';
import jwt from 'jsonwebtoken';
import { updateRoleInUserById, _findProjectById, insertRole, findUserById, updateRoleInProjectById } from '@/api-helper/database';

const handler = nc();

// Use the database middleware
handler.use(database);

handler.post(async (req, res) => {
  try {
    const { token } = req.body;

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, projectId, roleName, permissions } = decodedToken;


    const user = await findUserById(req.db, userId);
    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }



    const project = await _findProjectById(req.db, projectId);
    if (!project) {
      return res.status(404).json({ error: { message: 'Project not found' } });
    }

    

    // Insert the role for the user
    const role = await insertRole(req.db, { userId: user._id, projectId: project._id, name: roleName, permissions });
    await updateRoleInProjectById(req.db, projectId, role._id);
    await updateRoleInUserById(req.db, userId, role._id);

    res.status(201).json({ success: true, message: 'Role assigned successfully.' });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ error: { message: 'Invalid token' } });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ error: { message: 'Token expired' } });
    } else {
      return res.status(500).json({ error: { message: 'Something went wrong' } });
    }
  }
});

export default handler;
