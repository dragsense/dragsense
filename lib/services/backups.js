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
    if (id) url += `/${id}`;
    if (endpoint) url += `/${endpoint}`;
    if (query) url += `?${query}`;
    return url;
}

const BackupServices = {

    // Fetch a specific backup
    get: function (projectId, id) {
        return fetcher(buildEndpoint(projectId, id), {
            method: 'GET'
        }).then(handleErrors);
    },

    // Fetch all backups with pagination
    getAll: function (projectId, page, limit=10) {
        return fetcher(buildEndpoint(projectId, null, null, `limit=${limit}&page=${page}`), {
            method: 'GET'
        }).then(handleErrors);
    },

    // Search backups
    search: async function (projectId, search) {
        return fetcher(buildEndpoint(projectId, null, 'search', `search=${search}`), {
            method: 'GET',
        }).then(handleErrors);
    },

    // Create or update a backup
    createOrUpdate: function (projectId, id, states) {
        return fetcher(buildEndpoint(projectId, id), {
            method: id !== -1 ? 'PATCH' : 'POST',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...states }),
        }).then(handleErrors);
    },

    // Install a backup
    install: function (projectId, id) {
        return fetcher(buildEndpoint(projectId, id), {
            method: 'PATCH',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json' },
        }).then(handleErrors);
    },

    // Delete a backup
    delete: function (projectId, id) {
        return fetcher(buildEndpoint(projectId, id), {
            method: 'DELETE',
        }).then(handleErrors);
    }
}

export default BackupServices;