import {
    _findProjectById,
    findPublicThemeByIdWithProject,
  } from "@/api-helper/database";
  import { authorize, database } from "@/api-helper/middlewares";
  import { ncOpts } from "@/api-helper/nc";
  import nc from "next-connect";
  import request from "request";
  import { ObjectId } from "mongodb";
  
  const handler = nc(ncOpts);
  
  handler.use(database, authorize);
  
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
  
    const themes = project.themes || [];
  
    if (!themes.some((t) => t.equals(new ObjectId(themeId)))) {
      return res.status(404).json({
        error: {
          message: "The requested theme was not found in this project.",
        },
      });
    }
  
    const theme = await findPublicThemeByIdWithProject(req.db, themeId);
  
    if (!theme || !theme.published) {
      res.status(403).json({ error: { message: "Theme Not Was Found." } });
      return;
    }

    if (!theme.themeProject) {
      res.status(403).json({ error: { message: "Theme Project Was Not Found." } });
      return;
    }
  
    try {
      const { apiUrl, apiPrefix, apiVersion, apikey } = theme.themeProject;
      const themeProjectApiUrl = `${apiUrl}/${apiPrefix}/${apiVersion}`;

     // Construct URL and sanitize it
      const url = themeProjectApiUrl + "/backup" + `/${theme._id}`;
      const sanitizedUrl = url.replace(/([^:]\/)\/+/g, "$1");
  
      // Get readable stream and pipe it to response
      const readable = getReadableStream(sanitizedUrl, apikey);
      readable.pipe(res);
  
    } catch (e) {
      res.status(403).json({ error: { message: "Something went wrong." } });
      return;
    }
  });
  
  
  
  export default handler;
  