import { ValidateProps } from '@/api-helper/constants';
import {
    updateUserById,
    UNSAFE_updateUserPassword,
    findUserById
} from '@/api-helper/database';
import { database, authorize, validateBody } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import jwt from 'jsonwebtoken';

const handler = nc(ncOpts);
handler.use(database);

handler.post(
    validateBody({
        type: 'object',
        properties: {
            password: ValidateProps.user.password,

        },
        required: ['token', 'password'],
        additionalProperties: true,
    }),
    async (req, res) => {
        try {
            const { token, password } = req.body;


            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decodedToken._id;

            const user = await findUserById(req.db, userId);

            if (!user) {
                res.status(404).json({ error: { message: 'User not found' }});
                return;
            }


            if (user.resetPassword) {
                res.status(400).json({error: { message: 'Token has expired' }});
                return;
            }

            await UNSAFE_updateUserPassword(req.db, user._id, password)

            res.status(201).json({ success: true, message: 'Password reset successfuly' });
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                res.status(400).json({error: { message: 'Invalid token' }});
            } else if (error.name === 'TokenExpiredError') {
                res.status(400).json({ error: { message: 'Token has expired'} });
            } else {
                res.status(500).json({ error: { message: 'Failed to reset password'} });
            }
        }
    }
);

export default handler;