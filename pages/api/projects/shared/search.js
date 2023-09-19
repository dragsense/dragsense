import { findSharedProjectsBySearch } from '@/api-helper/database';
import {  database } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';

// Initialize next-connect with options
const handler = nc(ncOpts);

// Use database middleware
handler.use(database);

// Function to handle user validation
async function validateUser(req, res) {
  const user = await findUserByEmail(req.db, req.user.email);
  if (!user) {
    return res.status(401).end();
  }
  return user;
}

// Function to handle search results
async function handleSearchResults(req, res, user) {
  try {
    // Fetch shared projects by search
    const results = await findSharedProjectsBySearch(
      req.db,
      req.query.search,
      user._id
    );
    // Return results
    res.json(results);
  } catch (e) {
    // Handle error
    console.error(e);
    res.status(500).json({ error: { message: 'Something went wrong.' } });
  }
}

// Handle GET request
handler.get(async (req, res) => {
  const user = await validateUser(req, res);
  if (user) {
    await handleSearchResults(req, res, user);
  }
});

// Export handler
export default handler;
