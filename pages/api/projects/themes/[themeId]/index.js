
import { findBackupByIdWithUser } from '@/api-helper/database';
import { authorize, database } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';



const handler = nc(ncOpts);

handler.use(database, authorize);

handler.get(async (req, res) => {


  const id = req.query.themeId;

  try {

    const theme = await findBackupByIdWithUser(req.db, id);

    if (!theme) {

      res
        .status(403)
        .json({ error: { message: 'Theme Not Found.' } });
      return;
    }

    res.status(200).json({ theme });


  } catch (e) {
    res
      .status(403)
      .json({ error: { message: 'Something went wrong.' } });
    return;
  }





});



export default handler;