
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



const handler = nc(ncOpts);

handler.use(database, authorize);


handler.get(async (req, res) => {


  const project = await findProjectById(req.db, req.query.projectId);

  if (!project)
    return res.status(403).status(403)
      .json({ error: { message: 'Project Not Found.' } });

  const id = req.query.backupId;


  const backup = await findBackupById(req.db, id);

  if (!backup) {
    res
      .status(403)
      .json({ error: { message: 'Backup Not Found.' } });
    return;
  }

  try {


    const url = project.url + '/backup' + `/${backup._id}`;
    const apikey = project.apikey;

    const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

    const readable = request.get({
      url: `${sanitizedUrl}`,
      headers: { 'x-api-key': apikey }
    });


    readable.pipe(res);

  } catch (e) {

    res
      .status(403)
      .json({ error: { message: 'Something went wrong.' } });
    return;
  }

});

handler.post(
  async (req, res) => {

    const project = await findProjectById(req.db, req.query.projectId);

    if (!project)
      return res.status(403).status(403)
        .json({ error: { message: 'Project Not Found.' } });


    const backup = await findBackupById(req.db, req.query.backupId);

    if (!backup) {
      res
        .status(403)
        .json({ error: { message: 'Backup Not Found.' } });
      return;
    }

    const { name,
      preview,
      desc,
      published,
      update
    } = req.body;



    const _bckp = await findBackupByName(req.db, name, backup._id);

    if (_bckp) {
      if (req.query.backupId !== _bckp._id.toString()) {
        res
          .status(403)
          .json({ error: { message: 'Backup Name Already Exist.' } });
        return;
      }
    }



    try {

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

      res
        .status(403)
        .json({ error: { message: 'Something went wrong.' } });
      return;
    }
  });


handler.patch(
  async (req, res) => {

    const project = await findProjectById(req.db, req.query.projectId);

    if (!project)
      return res.status(403).status(403)
        .json({ error: { message: 'Project Not Found.' } });


    const backup = await findBackupById(req.db, req.query.backupId);

    if (!backup) {
      res
        .status(403)
        .json({ error: { message: 'Backup Not Found.' } });
      return;
    }


    try {

      const url = project.url + '/backup' + `/install/${backup._id}`;
      const apikey = project.apikey;

      const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

      await fetcher(`${sanitizedUrl}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apikey }

      });

      return res.json({ status: true });


    } catch (e) {

      console.log(e?.message)

      res
        .status(403)
        .json({ error: { message: 'Something went wrong.' } });
      return;
    }
  });




handler.delete(async (req, res) => {


  const project = await findProjectById(req.db, req.query.projectId);

  if (!project)
    return res.status(403).status(403)
      .json({ error: { message: 'Project Not Found.' } });


  const backup = await findBackupById(req.db, req.query.backupId);

  if (!backup) {
    res
      .status(403)
      .json({ error: { message: 'Backup not found.' } });
    return;
  }


  try {


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

    res
      .status(403)
      .json({ error: { message: 'Something went wrong.' } });
    return;
  }
}
);

export default handler;