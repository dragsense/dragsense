import { ValidateProps } from '@/api-helper/constants';
import { _findProjectById, updateProjectById, deleteProjectById, deleteRolesByProjectRoles } from '@/api-helper/database';
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
    const connection = await fetcher(`${project.url}`, {
      method: 'GET',
      headers: { 'x-api-key': project.apikey }

    });
    project.status = connection?.status;
  } catch (e) {
    
  }



  try {
    const creator = project.creator;

    res.json({ project: { ...project, creator: { name: creator.name, image: creator.image } } });

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

  try {


    // await deleteRolesByProjectRoles(req.db, Array.isArray(project.roles) ? project.roles : []);
    await deleteProjectById(req.db, project._id)

    return res.json({ status: true });

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

    try {

      const project = await updateProjectById(req.db, req.query.projectId, {
        name,
        desc,
        url,
      });

      return res.json({ project: project.value });
    }


    catch (e) {


      res
        .status(403)
        .json({ error: { message: e?.message } });
      return;
    }
  }
);


export default handler;