import { fetcher } from '../fetch';

// Helper function to handle fetch errors
const handleFetchError = (error) => {
    console.error('Error:', error);
    throw error;
}

// Helper function to construct URL
const constructUrl = (projectId, endpoint) => `/api/projects/${projectId}/${endpoint}`;

const UserServices = {

    // Fetch a single user
    get: async function (projectId, id) {
        try {
            return await fetcher(constructUrl(projectId, `users/${id}`), {
                method: 'GET'
            });
        } catch (error) {
            handleFetchError(error);
        }
    },

    // Fetch all users with pagination
    getAll: async function (projectId, page, limit = 10) {
        try {
            return await fetcher(constructUrl(projectId, `users?limit=${limit}&page=${page}`), {
                method: 'GET'
            });
        } catch (error) {
            handleFetchError(error);
        }
    },

    // Create or update a user
    createOrUpdate: async function (projectId, id, states) {
        try {
            return await fetcher(constructUrl(projectId, `users${id !== -1 ? '/' + id : ''}`), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...states }),
            });
        } catch (error) {
            handleFetchError(error);
        }
    },

    // Delete a user
    delete: async function (projectId, id) {
        try {
            return await fetcher(constructUrl(projectId, `users/${id}`), {
                method: 'DELETE',
            });
        } catch (error) {
            handleFetchError(error);
        }
    }
}

export default UserServices;