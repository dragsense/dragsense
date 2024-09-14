import { ValidateProps } from '@/api-helper/constants';
import { findProjects, insertProject, findUserByEmail, findProjectByName, updateProjectById } from '@/api-helper/database';
import { authorize, database, validateBody } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
const { randomUUID } = require('crypto');
const bcrypt = require('bcryptjs');

// Initialize next-connect with options
const handler = nc(ncOpts);

// Use database and authorize middleware
handler.use(database, authorize);

// Function to handle GET requests
handler.get(async (req, res) => {
  // Fetch user by email
  const user = await findUserByEmail(req.db, req.user.email);

  // If user not found, return 401 status
  if (!user)
    return res.status(401).end();

  try {
    // Fetch projects with pagination
    const results = await findProjects(
      req.db,
      req.query.page ? parseInt(req.query.page, 10) : 1,
      user._id,
      req.query.limit ? parseInt(req.query.limit, 10) : 10
    );

    // Return results with 200 status
    return res.status(200).json(results);

  } catch (e) {
    // Handle error and return 403 status with error message
    res
      .status(403)
      .json({ error: { message: 'Something went wrong.' } });
    return;
  }
});

// Function to handle POST requests
handler.post(
  validateBody({
    type: 'object',
    properties: {
      name: ValidateProps.project.name,
      apiUrl: ValidateProps.project.apiUrl,
      desc: ValidateProps.project.desc,
      apiVersion: ValidateProps.project.apiVersion,
      apiPrefix: ValidateProps.project.apiPrefix,
      platform: ValidateProps.project.platform,
    },
    required: ['name', 'apiUrl', 'apiVersion', 'apiPrefix', 'platform'],
    additionalProperties: true,
  }),
  async (req, res) => {
    // Destructure request body
    const { name, desc, apiUrl, apiVersion, apiPrefix, platform } = req.body;


    // Fetch user by email
    const user = await findUserByEmail(req.db, req.user.email);

    // If user not found, return 401 status
    if (!user)
      return res.status(401).end();

    try {
      // Generate random UUID and hash it
      let token = randomUUID();
      const apikey = await bcrypt.hash(token, 10);

      // Insert new project into database
      const project = await insertProject(req.db, {
        name,
        desc,
        apikey,
        apiUrl, apiVersion, apiPrefix, platform,
        activeTheme: null,
        creatorId: user._id,
      });

      // Return newly created project
      return res.json({project});
    }

    catch (e) {
      // Handle error and return 403 status with error message
      res
        .status(403)
        .json({ error: { message: 'Something went wrong.' } });
      return;
    }
  }
);

// Export handler
export default handler;

