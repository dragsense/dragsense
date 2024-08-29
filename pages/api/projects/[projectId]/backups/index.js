import { ValidateProps } from '@/api-helper/constants';
import { 
  _findProjectById,
  findBackupById, 
  findUserByEmail,
  findBackupByName, 
  deleteBackupById, 
  updateBackupById,
  insertBackup, 
  findBackupsByProjectId 
} from '@/api-helper/database';
import { authorize, database, validateBody } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import { fetcher } from '@/lib/fetch';

// Initialize next-connect handler
const handler = nc(ncOpts);

// Use database and authorize middlewares
handler.use(database, authorize);

// Function to handle GET request
handler.get(async (req, res) => {
  // Fetch project by ID
  const project = await _findProjectById(req.db, req.query.projectId);

  // If project not found, return error
  if (!project)
    return res.status(403).json({ error: { message: 'Project Not Found.' } });

  try {
    // Fetch backups by project ID
    const results = await findBackupsByProjectId(
      req.db,
      req.query.page ? parseInt(req.query.page, 10) : 1,
      project._id,
      req.query.limit ? parseInt(req.query.limit, 10) : 10
    );

    // Return backups
    return res.status(200).json(results);

  } catch (e) {
    // Handle error
    console.error(e);
    res.status(500).json({ error: { message: 'Something went wrong.' } });
  }
});

// Function to handle POST request
handler.post(validateBody({
  type: 'object',
  properties: {
    name: ValidateProps.backup.name,
  },
  required: ['name'],
  additionalProperties: true,
}),
  async (req, res) => {
    // Fetch project by ID
    const project = await _findProjectById(req.db, req.query.projectId);


    // If project not found, return error
    if (!project)
      return res.status(403).json({ error: { message: 'Project Not Found.' } });

    const { name, preview, desc, published } = req.body;

    // Check if backup already exists
    const backup = await findBackupByName(req.db, name);

    // If backup exists, return error
    if (backup) {
      return res.status(403).json({ error: { message: 'Backup Already Exist.' } });
    }

    // Fetch user by email
    const user = await findUserByEmail(req.db, req.user.email);

    // Insert new backup
    const newbackup = await insertBackup(req.db, {
      createdBy: user._id,
      preview,
      desc,
      published,
      name,
      projectId: project._id
    });

    // If backup creation failed, return error
    if (!newbackup) {
      return res.status(500).json({ error: { message: 'Something went wrong.' } });
    }

    const url = project.url + '/backup';

    try {
      const apikey = project.apikey;
      const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

      // Send POST request to backup URL
      await fetcher(`${sanitizedUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apikey },
        body: JSON.stringify({ _id: newbackup._id }),
      });

      // Return new backup
      return res.json({ backup: { ...newbackup, creator: req.user } });

    } catch (e) {
      // Handle error
      console.error(e);
      deleteBackupById(req.db, newbackup._id);
      res.status(500).json({ error: { message: 'Something went wrong.' } });
    }
  }
);

// Export handler
export default handler;