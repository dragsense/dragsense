import { ValidateProps } from '@/api-helper/constants';
import {
  findProjectById, _findProjectById, findThemesByProjectThemes, updateThemeInProjectById,
  findBackupByIdWithUser
} from '@/api-helper/database';
import { authorize, database, validateBody } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import request from 'request';
import { findBackupById } from '../../../../../api-helper/database/backups';
const stream = require('stream');

const handler = nc(ncOpts);

handler.use(database, authorize);



handler.get(async (req, res) => {


  const project = await _findProjectById(req.db, req.query.projectId);

  if (!project)
    return res.status(403).status(403)
      .json({ error: { message: 'Project Not Found.' } });

  try {

    const results = await findThemesByProjectThemes(
      req.db,
      null,
      Array.isArray(project.themes) ? project.themes : [],
      req.query.page ? parseInt(req.query.page, 10) : 0,
      req.query.limit ? parseInt(req.query.limit, 10) : 10
    );


    return res.status(200).json(results);

  } catch (e) {
    res
      .status(403)
      .json({ error: { message: 'Something went wrong.' } });
    return;
  }

});

handler.post(validateBody({
  type: 'object',
  properties: {
    id: ValidateProps.theme.id,
  },
  required: ['id'],
  additionalProperties: true,
}), async (req, res) => {


  const project = await _findProjectById(req.db, req.query.projectId);

  if (!project)
    return res.status(403).status(403)
      .json({ error: { message: 'Project Not Found.' } });

  const { id
  } = req.body;

  const themes = project.themes || [];

  if (themes.some((t) => t.equals(new ObjectId(id)))) {
    return res.status(404).json({
      error: {
        message: "The requested theme was already in this project.",
      },
    });
  }


  const theme = await findBackupById(req.db, id);

  if (!theme || theme.platform !== project.platform) {
    res
      .status(403)
      .json({ error: { message: 'Theme Not Found.' } });
    return;
  }


  try {
      updateThemeInProjectById(req.db, project._id, theme._id)
      return res.json({ theme });
  } catch (e) {
    res
      .status(403)
      .json({ error: { message: 'Something went wrong.' } });
    return;
  }

}
);



export default handler;