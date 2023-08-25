
import { ValidateProps } from '@/api-helper/constants';

import {
  findUserByEmail,
  _findProjectById,
  findRoleById,
  updateRoleById,
  deleteRoleById, deleteRoleInUserById,
  deleteRoleInProjectById
} from '@/api-helper/database';
import { authorize, database, validateBody } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';


const handler = nc(ncOpts);

handler.use(database, authorize);


handler.post(
  validateBody({
    type: 'object',
    properties: {
      roleName: ValidateProps.user.roleName,
      permissions: ValidateProps.user.permissions,
    },
    required: ['roleName', 'permissions'],
    additionalProperties: true,
  }),
  async (req, res) => {


    const project = await _findProjectById(req.db, req.query.projectId);

    if (!project)
      return res.status(403).status(403)
        .json({ error: { message: 'Project Not Found.' } });

    const { roleName, permissions } = req.body;




    if (!await findRoleById(req.db, req.query.roleId)) {
      res
        .status(403)
        .json({ error: { message: 'Role Not Found.' } });
      return;
    }

    try {

      const role = await updateRoleById(req.db, req.query.roleId, { name: roleName, permissions })

      return res.json({ role });

    } catch (e) {
      res
        .status(403)
        .json({ error: { message: e?.message || 'Something went wrong.' } });
      return;
    }
  }
);



handler.delete(async (req, res) => {


  const project = await _findProjectById(req.db, req.query.projectId);

  if (!project)
    return res.status(403).status(403)
      .json({ error: { message: 'Project Not Found.' } });


  const user = await findUserByEmail(req.db, req.user.email);

  const _role = await findRoleById(req.db, req.query.roleId)

  if (_role) {
   
    if (user && user._id.equals(_role.userId)) {
      res
        .status(403)
        .json({ error: { message: "You can't delete yourself." } });
      return;

    }
  }
  else {
    res
      .status(403)
      .json({ error: { message: 'Role Not Found.' } });
    return;
  }


  try {
    const role = await deleteRoleById(req.db, req.query.roleId);
    await deleteRoleInProjectById(req.db, role.value.projectId, role.value._id);
    await deleteRoleInUserById(req.db, role.value.userId, role.value._id);


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