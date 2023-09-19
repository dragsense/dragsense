import { _findProjectById, findUserByEmail } from '@/api-helper/database';
import { authorize, database, validateBody } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';

// Initialize next-connect with options
const handler = nc(ncOpts);

// Use database and authorize middleware
handler.use(database, authorize);

// Function to handle GET requests
const handleGet = async (req, res) => {
  try {
    // Find user by email
    const user = await findUserByEmail(req.db, req.user.email);

    // If user not found, return 401 status
    if (!user) throw new Error('User not found');

    // Find project by id
    const project = await _findProjectById(req.db, req.query.projectId);

    // If project not found, return 403 status
    if (!project) throw new Error('Project not found');

    // Get cookies from request
    const cookies = req.cookies;

    // Return cookies and project id
    res.status(200).json({ cookies, projectId: project._id });
  } catch (e) {
    // Handle errors and return appropriate status and message
    const status = e.message === 'User not found' ? 401 : e.message === 'Project not found' ? 403 : 500;
    res.status(status).json({ error: { message: e.message } });
  }
};

// Use handleGet function for GET requests
handler.get(handleGet);

// Export handler
export default handler;
