import { findProjectsBySearch } from '@/api-helper/database';
import {  database } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';

// Create a handler with next-connect
const handler = nc(ncOpts);

// Use the database middleware
handler.use(database);

// Function to handle the GET request
const handleGetRequest = async (req, res) => {


      // Fetch user by email
      const user = await findUserByEmail(req.db, req.user.email);

      // If user not found, return 401 status
      if (!user) return res.status(401).end();
    
      let by = user._id;
    
      if (user.email === process.env.ADMIN) {
        by = null;
      }
    


  try {
    // Fetch projects with pagination
    const results = await findProjects(
      req.db,
      req.query.search,
      by,
      req.query.page ? parseInt(req.query.page, 10) : 1,
      req.query.limit ? parseInt(req.query.limit, 10) : 10
    );


    // Send the results as a response
    res.json(results);

  } catch (e) {
    // Handle any errors
    console.error(e);
    res
      .status(500)
      .json({ error: { message: 'Something went wrong.' } });
  }
};

// Use the handleGetRequest function for GET requests
handler.get(handleGetRequest);

// Export the handler
export default handler;
