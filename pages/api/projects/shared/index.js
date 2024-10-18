import { findRolesByUserProjects, findUserByEmail } from '@/api-helper/database';
import { authorize, database } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';

// Initialize next-connect with options
const handler = nc(ncOpts);

// Use database and authorize middlewares
handler.use(database, authorize);

// Function to handle user roles
const handleUserRoles = async (req, res, user) => {
    try {
        // Fetch roles by user projects
        const results = await findRolesByUserProjects(
            req.db,
            Array.isArray(user.roles) ? user.roles : [],
            null,
            req.query.page ? parseInt(req.query.page, 10) : 1,
            req.query.limit ? parseInt(req.query.limit, 10) : 10
        );
        // Return results
        return res.status(200).json(results);
    } catch (e) {
        // Handle error
        console.error(e);
        res.status(500).json({ error: { message: 'Something went wrong.' } });
    }
};

handler.get(async (req, res) => {
    // Find user by email
    const user = await findUserByEmail(req.db, req.user.email);

    // If user not found, return 401
    if (!user) {
        return res.status(401).end();
    }

    // Handle user roles
    return handleUserRoles(req, res, user);
});

// Export handler
export default handler;
