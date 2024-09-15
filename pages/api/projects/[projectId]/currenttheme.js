import { ValidateProps } from "@/api-helper/constants";
import {
  _findProjectById,
  findBackupByIdWithUser,
} from "@/api-helper/database";
import { authorize, database } from "@/api-helper/middlewares";
import { ncOpts } from "@/api-helper/nc";
import nc from "next-connect";

const handler = nc(ncOpts);

// Middleware for database and authorization
handler.use(database, authorize);

// Function to fetch project details
async function fetchProjectDetails(db, projectId) {
  try {
    const project = await _findProjectById(db, projectId);
    if (!project) {
      return { error: { status: 404, message: "Project Not Found." } };
    }
    return { project };
  } catch (e) {
    console.error("Error fetching project details:", e);
    return {
      error: { status: 500, message: "Failed to fetch project details." },
    };
  }
}

// Function to fetch theme details
async function fetchThemeDetails(db, themeId) {
  try {
    const theme = await findBackupByIdWithUser(db, themeId);
    if (!theme) {
      return { theme: null };
    }
    return {
      theme: {
        name: theme.name,
        desc: theme.desc,
        preview: theme.preview,
        platform: theme.platform,
        creator: theme.creator?.name,
        creatorProfile: theme.creator?.image || null,
      },
    };
  } catch (e) {
    console.error("Error fetching theme details:", e);
    return {
      error: { status: 500, message: "Failed to retrieve theme details." },
    };
  }
}

// GET handler
handler.get(async (req, res) => {
  const { projectId } = req.query;

  // Fetch project details
  const { project, error } = await fetchProjectDetails(req.db, projectId);
  if (error) {
    res.status(error.status).json({ error: { message: error.message } });
    return;
  }

  // Fetch theme details
  const { theme, error: themeError } = await fetchThemeDetails(
    req.db,
    project.activeTheme
  );
  if (themeError) {
    res
      .status(themeError.status)
      .json({ error: { message: themeError.message } });
    return;
  }

  // Send response with theme details
  res.json({ theme });
});

export default handler;
