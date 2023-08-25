import { findRolesByUserProjects, findUserByEmail, } from '@/api-helper/database';
import { authorize, database } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(database, authorize);

handler.get(async (req, res) => {

    const user = await findUserByEmail(req.db, req.user.email);

    if (!user)
        return res.status(401).end();

    try {
        const results = await findRolesByUserProjects(
            req.db,
            Array.isArray(user.roles) ? user.roles : [],
            req.query.page ? parseInt(req.query.page, 10) : 1,
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


export default handler;
