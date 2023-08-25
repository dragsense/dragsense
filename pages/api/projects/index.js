import { ValidateProps } from '@/api-helper/constants';
import { findProjects, insertProject, findUserByEmail, findProjectByName, updateProjectById } from '@/api-helper/database';
import { authorize, database, validateBody } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
const { randomUUID } = require('crypto');
const bcrypt = require('bcryptjs');

const handler = nc(ncOpts);

handler.use(database, authorize);

handler.get(async (req, res) => {

  const user = await findUserByEmail(req.db, req.user.email);

  if (!user)
    return res.status(401).end();

  try {
    const results = await findProjects(
      req.db,
      req.query.page ? parseInt(req.query.page, 10) : 1,
      user._id,
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

handler.post(
  validateBody({
    type: 'object',
    properties: {
      name: ValidateProps.project.name,
      url: ValidateProps.project.url,
      port: ValidateProps.project.desc,

    },
    required: ['name', 'url'],
    additionalProperties: true,
  }),
  async (req, res) => {

    const { name, desc, url } = req.body;

    if (await findProjectByName(req.db, name)) {
      res
        .status(403)
        .json({ error: { message: 'The Project has already been used.' } });
      return;
    }

    const user = await findUserByEmail(req.db, req.user.email);

    if (!user)
      return res.status(401).end();

    try {

      let token = randomUUID();
      const apikey = await bcrypt.hash(token, 10);

      const project = await insertProject(req.db, {
        name,
        url,
        desc,
        apikey,
        activeTheme: 0,
        creatorId: user._id,
      });

      return res.json({project});
    }

    catch (e) {

      res
        .status(403)
        .json({ error: { message: 'Something went wrong.' } });
      return;
    }
  }
);



export default handler;
