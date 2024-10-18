import { fetcher } from "../fetch";

// Helper function to handle fetch errors
const handleFetchError = (error) => {
  console.error("Error:", error);
  throw error;
};

// Helper function to create fetch options
const createFetchOptions = (method, headers = {}, body = null) => ({
  method,
  headers,
  body: body ? JSON.stringify(body) : null,
});

const AIServices = {

  
  // Function to create or update a project
  retrainModel: async function (states) {
    try {
      return fetcher(
        `/api/ai`,
        createFetchOptions(
          "PUT",
          { "Content-Type": "application/json" },
          { ...states }
        )
      );
    } catch (error) {
      handleFetchError(error);
    }
  },

  generateJSON: async function (states) {
    try {
      return fetcher(
        `/api/ai`,
        createFetchOptions(
          "POST",
          { "Content-Type": "application/json" },
          { ...states }
        )
      );
    } catch (error) {
      handleFetchError(error);
    }
  },
};

export default AIServices;
