import { ValidateProps } from '@/api-helper/constants';
import {
  findProjectById,
  findBackupByUuid,
  findBackupById,
  findBackupByName, deleteBackupById, updateBackupById
} from '@/api-helper/database';
import { authorize, database, validateBody } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import { fetcher } from '@/lib/fetch';
import fetch from 'node-fetch';
import { v4 as uuid } from 'uuid';
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

// Function to get backup details
const getBackup = async (req, res, id) => {
  const backup = await findBackupById(req.db, id);
  if (!backup) {
    res.status(403).json({ error: { message: 'Backup Not Found.' } });
    throw new Error('Backup Not Found');
  }
  return backup;
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
    const backup = await getBackup(req, res, req.query.backupId);

    // Construct URL and sanitize it
    const url = project.url + '/backup' + `/${backup._id}`;
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

// Function to handle POST request
handler.post(
  async (req, res) => {
    try {
      const project = await getProject(req, res);
      const backup = await getBackup(req, res, req.query.backupId);

      const { name, preview, desc, published, update } = req.body;

      const _bckp = await findBackupByName(req.db, name, backup._id);

      if (_bckp && req.query.backupId !== _bckp._id.toString()) {
        res.status(403).json({ error: { message: 'Backup Name Already Exist.' } });
        return;
      }

      const updated = await updateBackupById(req.db, backup._id, {
        preview,
        desc,
        published,
        name
      })

      if (update) {
        const url = project.url + '/backup' + `/${backup._id}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        await fetcher(`${sanitizedUrl}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-api-key': apikey }
        });
      }
      return res.json({ backup: updated });

    } catch (e) {
      console.error(e);
      res.status(500).json({ error: { message: 'Something went wrong.' } });
    }
  });

// Function to handle PATCH request
handler.patch(
  async (req, res) => {
    try {
      const project = await getProject(req, res);
      const backup = await getBackup(req, res, req.query.backupId);

      const url = project.url + '/backup' + `/install/${backup._id}`;
      const apikey = project.apikey;
      const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

      await fetcher(`${sanitizedUrl}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apikey }
      });


      return res.json({ status: true });

    } catch (e) {
      console.error(e);
      res.status(500).json({ error: { message: 'Something went wrong.' } });
    }  
  });
 
// Function to handle DELETE request
handler.delete(async (req, res) => {
  try {
    const project = await getProject(req, res);
    const backup = await getBackup(req, res, req.query.backupId);

    await deleteBackupById(req.db, backup._id);

    const url = project.url + '/backup' + `/${backup._id}`;
    const apikey = project.apikey;
    const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

    fetcher(`${sanitizedUrl}`, {
      method: 'DELETE',
      headers: { 'x-api-key': apikey },
    });

    return res.json({ status: true });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: { message: 'Something went wrong.' } });
  }
});

export default handler;