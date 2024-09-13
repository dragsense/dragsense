
import { _findProjectById,  findBackupsByProjectId} from '@/api-helper/database';
import {  database } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {

    const project = await _findProjectById(req.db, req.query.projectId);

    if (!project)
        return res.status(403).json({ error: { message: 'Project Not Found.' } });
    


  try {

    const results = await findBackupsByProjectId(
        req.db,
        req.query.search || '',
        req.query.page ? parseInt(req.query.page, 10) : 1,
        project._id,
        req.query.limit ? parseInt(req.query.limit, 10) : 10
      );

    res.json(results);

  } catch (e) {
    res
      .status(403)
      .json({ error: { message: 'Something went wrong.' } });
    return;
  }

});



export default handler;
