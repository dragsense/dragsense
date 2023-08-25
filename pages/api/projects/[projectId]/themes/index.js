import { ValidateProps } from '@/api-helper/constants';
import {
  findProjectById, _findProjectById, findThemesByProjectThemes, updateThemeInProjectById,
  findBackupByIdWithUser
} from '@/api-helper/database';
import { authorize, database, validateBody } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import request from 'request';
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


  const theme = await findBackupByIdWithUser(req.db, id);

  if (!theme) {
    res
      .status(403)
      .json({ error: { message: 'Theme Not Found.' } });
    return;
  }


  const themeProject = await _findProjectById(req.db, theme.projectId);


  if (!themeProject)
    return res.status(403).status(403)
      .json({ error: { message: 'Theme Not Found.' } });

  try {



    const readable = request.get({
      url: `${project.url}/api/backups/${theme._id}`,
      headers: { 'x-api-key': project.apikey }
    });

    const writeable = request.post({
      url: `${themeProject.url}/api/themes/${theme._id}`,
      headers: {
        'x-api-key': themeProject.apikey
      }
    })

    readable.pipe(writeable).on('error', (err) => {
      res.status(500).send('Error occurred while sending files');
    }).on('end', () => {
      updateThemeInProjectById(req.db, project._id, theme._id)
      return res.json({ theme });
    });

  



  } catch (e) {


    res
      .status(403)
      .json({ error: { message: 'Something went wrong.' } });
    return;
  }

}
);

export default handler;