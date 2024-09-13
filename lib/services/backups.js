import { fetcher } from '../fetch';

// Helper function to handle fetch errors
const handleErrors = response => {

    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

// Helper function to build the API endpoint
const buildEndpoint = (projectId, id, endpoint, query) => {
    let url = `/api/projects/${projectId}/backups`;
    if (id && id !== -1) url += `/${id}`;
    if (endpoint) url += `/${endpoint}`;
    if (query) url += `?${query}`;
   
    return url;
}

const BackupServices = {

    // Fetch a specific backup
    get: async function (projectId, id) {
        return fetcher(buildEndpoint(projectId, id), {
            method: 'GET'
        })
    },

    // Fetch all backups with pagination
    getAll: async function (projectId, page, limit=10) {
        return fetcher(buildEndpoint(projectId, null, null, `limit=${limit}&page=${page}`), {
            method: 'GET'
        })
    },

    // Search backups
    search: async function (projectId, search, page, limit=10) {
        return fetcher(buildEndpoint(projectId, null, 'search', `search=${search}&limit=${limit}&page=${page}`), {
            method: 'GET'
        })
    },

    // Create or update a backup
    createOrUpdate: function (projectId, id, states) {
        return fetcher(buildEndpoint(projectId, id), {
            method: 'POST',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...states }),
        })
    },

    // Install a backup
    install: function (projectId, id) {
        return fetcher(buildEndpoint(projectId, id), {
            method: 'PATCH',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json' },
        })
    },

    // Delete a backup
    delete: function (projectId, id) {
        return fetcher(buildEndpoint(projectId, id), {
            method: 'DELETE',
        })
    }
}

export default BackupServices;