import { _findProjectById, findUserByEmail } from '@/api-helper/database';
import { authorize, database, validateBody } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(database, authorize);

handler.get(async (req, res) => {

  const user = await findUserByEmail(req.db, req.user.email);

  if (!user)
    return res.status(401).end();

  const project = await _findProjectById(req.db, req.query.projectId);

  if (!project)
    return res.status(403).status(403)
      .json({ error: { message: 'Project Not Found.' } });



  try {

    const cookies = req.cookies;
    res.status(200).json({ cookies, projectId: project._id });

  } catch (e) {

    res
      .status(403)
      .json({ error: { message: 'Something went wrong.' } });
    return;
  }

});

export default handler;
