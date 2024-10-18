
import { findUsers } from '@/api-helper/database';
import {  authorize, database } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(authorize, database);

handler.get(async (req, res) => {
  try {
 
    const results = await findUsers(
      req.db,
      req.query.search || '',
      req.query.page ? parseInt(req.query.page, 10) : 0,
      req.query.limit ? parseInt(req.query.limit, 10) : 10
    );

    res.json(results);

  } catch (e) {
    res
      .status(403)
      .json({ error: { message: e?.message || 'Something went wrong.' } });
    return;
  }

});



export default handler;
