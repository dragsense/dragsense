import { ValidateProps } from "@/api-helper/constants";
import { findUserByEmail } from "@/api-helper/database";
import { database, authorize } from "@/api-helper/middlewares";
import { ncOpts } from "@/api-helper/nc";
import nc from "next-connect";
// Initialize next-connect with options
const handler = nc(ncOpts);

// Use database middleware
handler.use(database, authorize);

// Function to handle GET requests
handler.get(async (req, res) => {
  try {
    const user = await findUserByEmail(req.db, req.query.email);

    if (!user) {
      res.status(404).json({ error: { message: "User Not Found." } });
      return null;
    }

    // Send the fetched users as a response
    res.status(200).json(user);
  } catch (e) {
    // Handle error and return 403 status with error message
    res.status(403).json({ error: { message: "Something went wrong." } });
    return;
  }
});

export default handler;
