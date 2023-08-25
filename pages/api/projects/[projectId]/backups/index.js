import { ValidateProps } from '@/api-helper/constants';
import { _findProjectById,
  findBackupById, 
  findUserByEmail,
   findBackupByName, 
   deleteBackupById, 
   updateBackupById,
   insertBackup, 
   findBackupsByProjectId } from '@/api-helper/database';
import { authorize, database, validateBody } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import { fetcher } from '@/lib/fetch';

const handler = nc(ncOpts);

handler.use(database, authorize);


handler.get(async (req, res) => {


  const project = await _findProjectById(req.db, req.query.projectId);

  if (!project)
    return res.status(403).status(403)
      .json({ error: { message: 'Project Not Found.' } });

  try {


    const results = await findBackupsByProjectId(
      req.db,
      req.query.page ? parseInt(req.query.page, 10) : 1,
      project._id,
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
    name: ValidateProps.backup.name,
  },
  required: ['name'],
  additionalProperties: true,
}),
  async (req, res) => {


    const project = await _findProjectById(req.db, req.query.projectId);

    if (!project)
      return res.status(403).status(403)
        .json({ error: { message: 'Project Not Found.' } });

    const { name,
      preview,
      desc,
      published
    } = req.body;

    
  

    const backup = await findBackupByName(req.db, name);

    if (backup) {

      res
        .status(403)
        .json({ error: { message: 'Backup Already Exist.' } });
      return;
    }

    const user = await findUserByEmail(req.db, req.user.email);


    const newbackup = await insertBackup(req.db, {
      createdBy: user._id,
      preview,
      desc,
      published,
      name,
      projectId: project._id
    });


    if (!newbackup) {
      res
        .status(403)
        .json({ error: { message: 'Something went wrong.' } });
      return;
    }
    const url = project.url + '/backup';

    try {

      const apikey = project.apikey;

      const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

      await fetcher(`${sanitizedUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apikey },
        body: JSON.stringify({ _id: newbackup._id }),
      });


      return res.json({ backup: { ...newbackup, creator: req.user } });

    } catch (e) {

      deleteBackupById(req.db, newbackup._id);

      res
        .status(403)
        .json({ error: { message: 'Something went wrong.' } });
      return;
    }

  }
);



export default handler;