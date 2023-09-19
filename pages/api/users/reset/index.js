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

// Create a handler with next-connect
const handler = nc(ncOpts);

// Use the database middleware
handler.use(database);

// Function to validate the body of the request
const validateRequestBody = validateBody({
    type: 'object',
    properties: {
        password: ValidateProps.user.password,
    },
    required: ['token', 'password'],
    additionalProperties: true,
});

// Function to handle the POST request
const handlePostRequest = async (req, res) => {
    try {
        const { token, password } = req.body;

        // Decode the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken._id;

        // Find the user by ID
        const user = await findUserById(req.db, userId);

        // If the user is not found, return an error
        if (!user) {
            return res.status(404).json({ error: { message: 'User not found' }});
        }

        // If the reset password token has expired, return an error
        if (user.resetPassword) {
            return res.status(400).json({error: { message: 'Token has expired' }});
        }

        // Update the user's password
        await UNSAFE_updateUserPassword(req.db, user._id, password);

        // If everything is successful, return a success message
        return res.status(201).json({ success: true, message: 'Password reset successfuly' });
    } catch (error) {
        // Handle different types of errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({error: { message: 'Invalid token' }});
        } else if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ error: { message: 'Token has expired'} });
        } else {
            return res.status(500).json({ error: { message: 'Failed to reset password'} });
        }
    }
};

// Use the validateRequestBody and handlePostRequest functions in the handler
handler.post(validateRequestBody, handlePostRequest);

export default handler;