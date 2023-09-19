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
  try {
    // Fetch the projects based on the search query
    const results = await findProjectsBySearch(
      req.db,
      req.query.search,
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
