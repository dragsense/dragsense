import {
  findRoles,
} from '@/api-helper/database';
import { database} from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);
handler.use(database);

handler.get(async (req, res) => {

  const roles = await findRoles(
    req.db,
    req.query.page ? parseInt(req.query.page, 10) : 0,
    req.query.limit ? parseInt(req.query.limit, 10) : 10
  );

  res.json(roles);
});


export default handler;
