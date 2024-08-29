import { ValidateProps } from '@/api-helper/constants';
import { _findProjectById, updateProjectById, deleteProjectById, deleteRolesByProjectRoles } from '@/api-helper/database';
import { authorize, database, validateBody } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import { fetcher } from '@/lib/fetch';
const handler = nc(ncOpts);

// Middleware for database and authorization
handler.use(database, authorize);
// Function to fetch project details
async function fetchProjectDetails(req, res) {
  try {
    const project = await _findProjectById(req.db, req.query.projectId);
    if (!project) {
      res.status(404).json({ error: { message: 'Project Not Found.' } });
      return null;
    }
    return project;
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: { message: 'Failed to fetch project details.' } });
    return null;
  }
}

// Function to fetch project status
async function fetchProjectStatus(project) {
  try {
    const connection = await fetcher(`${project.url}`, {
      method: 'GET',
      headers: { 'x-api-key': project.apikey }
    }); 
    project.status = connection?.status || false; // Default status if connection fails
  } catch (e) {
    console.error(e);
    project.status = false; // Set a fallback status
  }
}

// Function to send project details
function sendProjectDetails(res, project) {
  try {
    const creator = project.creator;

    res.json({ project: { ...project, creator: { name: creator?.name || 'Unknown', image: creator?.image || null } } });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: { message: 'Failed to send project details.' } });
  }
}

// GET handler
handler.get(async (req, res) => {
  const project = await fetchProjectDetails(req, res);
  if (!project) return; // Exit early if project is not found or an error occurred
  await fetchProjectStatus(project);

  sendProjectDetails(res, project);
});


// Function to delete project
async function deleteProject(req, res) {
  const project = await fetchProjectDetails(req, res);
  if (!project) return;
  try {
    await deleteProjectById(req.db, project._id)
    return res.json({ status: true });
  } catch (e) {
    console.error(e);
    res.status(403).json({ error: { message: 'Something went wrong.' } });
  }
}

// DELETE handler
handler.delete(async (req, res) => {
  await deleteProject(req, res);
});

// Function to update project
async function updateProject(req, res) {
  const { name, desc, url } = req.body;
  try {
    const project = await updateProjectById(req.db, req.query.projectId, {
      name,
      desc,
      url,
    });
    return res.json({ project: project.value });
  } catch (e) {
    console.error(e);
    res.status(403).json({ error: { message: e?.message } });
  }
}

// POST handler
handler.post(
  validateBody({
    type: 'object',
    properties: {
      name: ValidateProps.project.name,
      url: ValidateProps.project.url,
      port: ValidateProps.project.desc,
    },
    required: ['name', 'url'],
    additionalProperties: true,
  }),
  async (req, res) => {
    await updateProject(req, res);
  }
);

export default handler;