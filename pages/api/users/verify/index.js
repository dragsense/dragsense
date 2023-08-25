import { ValidateProps } from '@/api-helper/constants';
import {
    updateUserById,
    UNSAFE_updateUserPassword,
    findUserById
} from '@/api-helper/database';
import { database, authorize } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

const handler = nc(ncOpts);
handler.use(database);

const validateBody = (schema) => {
    return async (req, res, next) => {
      try {
        await schema.validateAsync(req.body);
        next();
      } catch (error) {
        res.status(400).json({ error: { message: error.details[0].message } });
      }
    };
  };
  
  const resetSchema = Joi.object({
    token: Joi.string().required()
  });



handler.post(
    validateBody(resetSchema),
    async (req, res) => {
        try {
            const { token } = req.body;


            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decodedToken._id;

            const user = await findUserById(req.db, userId);

            if (!user) {
                res.status(404).json({ error: { message: 'User not found' } });
                return;
            }


            if (user.emailVerified) {
                res.status(400).json({ error: { message: 'Token has expired' } });
                return;
            }

            await updateUserById(req.db, user._id, { emailVerified: true })

            res.status(201).json({ success: true, message: 'User verified' });
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                res.status(400).json({ error: { message: 'Invalid token' } });
            } else if (error.name === 'TokenExpiredError') {
                res.status(400).json({ error: { message: 'Token has expired' } });
            } else {
                res.status(500).json({ error: { message: 'Failed to verify' } });
            }
        }
    }
);

export default handler;