
import { _findProjectById, updateBackupById, findBackupByUuid, findBackupByIdWithUser, 
  updateProjectById, deleteThemeInProjectById,
    findBackupById } from '@/api-helper/database';
import { authorize, database } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import { v4 as uuid } from 'uuid';
import { fetcher } from '@/lib/fetch';
import fetch from 'node-fetch';
import request from 'request';


const handler = nc(ncOpts);

handler.use(database, authorize);

handler.get(async (req, res) => {

  const project = await _findProjectById(req.db, req.query.projectId);

  if (!project)
    return res.status(403)
      .json({ error: { message: 'Project Not Found.' } });

  const id = req.query.themeId;
 

  const theme = await findBackupByUuid(req.db, id);



  if (!theme) {
    res
      .status(403)
      .json({ error: { message: 'Theme Not Found.' } });
    return;
  }
  await updateBackupById(req.db, theme._id, { uuid: undefined })

  try {

   

    const readable = request.get({
      url: `${project.url}/api/themes/${theme._id}`,
      headers: { 'x-api-key': project.apikey }
    });


    readable.pipe(res);

  } catch (e) {



    res
      .status(403)
      .json({ error: { message: 'Something went wrong.' } });
    return;
  }

});



handler.post(async (req, res) => {


  const project = await _findProjectById(req.db, req.query.projectId);

  if (!project)
    return res.status(403).status(403)
      .json({ error: { message: 'Project Not Found.' } });


  const theme = await findBackupByIdWithUser(req.db, req.query.themeId);

  if (!theme) {
    res
      .status(403)
      .json({ error: { message: 'Theme Not Found.' } });
    return;
  }


  try {

  
    await fetcher(`${project.url}/api/themes/${theme._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-api-key': project.apikey }
    });

    await updateProjectById(req.db, project._id, {activeTheme: theme._id})
  
    return res.json({ status: true });

  } catch (e) {


    res
      .status(403)
      .json({ error: { message: 'Something went wrong.' } });
    return;
  }

}
);

handler.patch(
  async (req, res) => {

    const project = await _findProjectById(req.db, req.query.projectId);

    if (!project)
      return res.status(403).status(403)
        .json({ error: { message: 'Project Not Found.' } });


    const theme = await findBackupById(req.db, req.query.themeId);

    if (!theme) {
      res
        .status(403)
        .json({ error: { message: 'Theme Not Found.' } });
      return;
    }


    try {

      const _uuid = uuid();

      await updateBackupById(req.db, theme._id, { uuid: _uuid })

      return res.json({ status: true, uuid: _uuid });

    } catch (e) {
  

      res
        .status(403)
        .json({ error: { message: 'Something went wrong.' } });
      return;
    }
  });


handler.delete(async (req, res) => {


  const project = await _findProjectById(req.db, req.query.projectId);

  if (!project)
    return res.status(403).status(403)
      .json({ error: { message: 'Project Not Found.' } });


  const theme = await findBackupById(req.db, req.query.themeId);



  if (!theme) {
    res
      .status(403)
      .json({ error: { message: 'Theme not found.' } });
    return;
  }

  try {

  await deleteThemeInProjectById(req.db, project._id, theme._id);


  const url = project.url;
  const apikey = project.apikey;


  await fetcher(`${url}/api/themes/${theme._id}`, {
    method: 'DELETE',
    headers: { 'x-api-key': apikey },

  });

  return res.json({ status: true });

} catch (e) {

  res
    .status(403)
    .json({ error: { message: 'Something went wrong.' } });
  return;
}

}
);

export default handler;