
import { findSharedProjectsBySearch } from '@/api-helper/database';
import {  database } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {

  const user = await findUserByEmail(req.db, req.user.email);

  if (!user)
      return res.status(401).end();


  try {
    const results = await findSharedProjectsBySearch(
      req.db,
      req.query.search,
      user._id
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
