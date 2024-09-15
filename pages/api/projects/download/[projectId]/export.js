import {
  findProjectById,
} from '@/api-helper/database';
import { authorize, database } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import request from 'request';

// Initialize Next.js Connect with options
const handler = nc(ncOpts);

// Use database and authorization middlewares
handler.use(database, authorize);

// Function to get project details
const getProject = async (req, res) => {
  const project = await findProjectById(req.db, req.query.projectId);
  if (!project) {
    res.status(403).json({ error: { message: 'Project Not Found.' } });
    throw new Error('Project Not Found');
  }
  return project;
}


// Function to get readable stream
const getReadableStream = (url, apikey) => {
  return request.get({
    url: `${url}`,
    headers: { 'x-api-key': apikey }
  });
}

// Main handler function
handler.get(async (req, res) => {
  try {
    // Fetch project and backup
    const project = await getProject(req, res);
    
    const queryParams = new URLSearchParams(req.query).toString();

    const url = project.apiUrl + `/autocode-project/download?${queryParams}`;

    const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

    // Get readable stream and pipe it to response
    const readable = getReadableStream(sanitizedUrl, project.apikey);
    readable.pipe(res);

  } catch (e) {
    // Improved error handling
    console.error(e);
    res.status(500).json({ error: { message: e.message } });
  }
});


export default handler;