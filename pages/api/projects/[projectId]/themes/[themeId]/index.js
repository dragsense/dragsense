import {
  _findProjectById,
  updateBackupById,
  findBackupByIdWithUser,
  updateProjectById,
  deleteThemeInProjectById,
  findPublicThemeById,
  findBackupById,
} from "@/api-helper/database";
import { authorize, database } from "@/api-helper/middlewares";
import { ncOpts } from "@/api-helper/nc";
import nc from "next-connect";
import { v4 as uuid } from "uuid";
import { fetcher } from "@/lib/fetch";
import request from "request";
import { ObjectId } from "mongodb";

const handler = nc(ncOpts);

handler.use(database);

const getReadableStream = (url, apikey) => {
  return request.get({
    url: `${url}`,
    headers: { "x-api-key": apikey },
  });
};

handler.get(async (req, res) => {
  const projectId = req.query.projectId;
  const themeId = req.query.themeId;

  if (!projectId || !themeId) {
    return res.status(400).json({
      error: {
        message: "Missing required parameters: projectId or themeId.",
      },
    });
  }

  const project = await _findProjectById(req.db, projectId);

  if (!project) {
    return res.status(404).json({ error: { message: "Project Not Found." } });
  }


  const theme = await findPublicThemeById(req.db, themeId);

  if (!theme || !theme.published) {
    res.status(403).json({ error: { message: "Theme Not Found." } });
    return;
  }

  try {
   // Construct URL and sanitize it
    const url = project.url + "/backup" + `/${theme._id}`;
    const sanitizedUrl = url.replace(/([^:]\/)\/+/g, "$1");

    // Get readable stream and pipe it to response
    const readable = getReadableStream(sanitizedUrl, project.apikey);
    readable.pipe(res);
    res.status(200).json({ message: "working" } );

  } catch (e) {
    res.status(403).json({ error: { message: "Something went wrong." } });
    return;
  }
});

handler.post(authorize, async (req, res) => {
  const projectId = req.query.projectId;
  const themeId = req.query.themeId;

  if (!projectId || !themeId) {
    return res.status(400).json({
      error: {
        message: "Missing required parameters: projectId or themeId.",
      },
    });
  }

  const project = await _findProjectById(req.db, projectId);

  if (!project) {
    return res.status(404).json({ error: { message: "Project Not Found." } });
  }

  const themes = project.themes || [];

  if (!themes.some((t) => t.equals(new ObjectId(themeId)))) {
    return res.status(404).json({
      error: {
        message: "The requested theme was not found in this project.",
      },
    });
  }

  const theme = await findPublicThemeById(req.db, themeId);

  if (!theme || !theme.published || theme.platform !== project.platform) {
    res.status(403).json({ error: { message: "Theme Not Found." } });
    return;
  }

  try {
 
    await fetcher(`${project.url}/themes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': project.apikey
      },
      body: JSON.stringify({
        themeId: theme._id.toString(),
        projectId: theme.projectId.toString(),
        url: process.env.URL

      })
    });

    await updateProjectById(req.db, project._id, { activeTheme: theme._id });

    return res.json({ status: true });
  } catch (e) {
    res.status(403).json({ error: { message: "Something went wrong." } });
    return;
  }
});

handler.delete(authorize, async (req, res) => {
  const project = await _findProjectById(req.db, req.query.projectId);

  if (!project)
    return res
      .status(403)
      .status(403)
      .json({ error: { message: "Project Not Found." } });

  const theme = await findBackupById(req.db, req.query.themeId);

  if (!theme) {
    res.status(403).json({ error: { message: "Theme not found." } });
    return;
  }

  try {
    await deleteThemeInProjectById(req.db, project._id, theme._id);

    return res.json({ status: true });
  } catch (e) {
    res.status(403).json({ error: { message: "Something went wrong." } });
    return;
  }
});

export default handler;
