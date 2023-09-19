import { fetcher } from '../fetch';

// Helper function to get project details
const getProjectDetails = async () => {
    const projectId = localStorage.getItem("project");
    const response = await fetcher('/api/projects/' + projectId, {
        method: 'GET'
    }).catch(error => {
        console.error('Error fetching project details:', error);
        throw error;
    });
    return response.project;
}

// Helper function to sanitize URL
const sanitizeUrl = (url) => {
    return url.replace(/([^:]\/)\/+/g, '$1');
}

const LayoutServices = {

    get: async function (id) {
        // Fetch project details
        const project = await getProjectDetails();
        const url = project.url + `/layouts/${id}`;
        const apikey = project.apikey;
        const sanitizedUrl = sanitizeUrl(url);

        // Fetch layout details
        return fetcher(`${sanitizedUrl}`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        }).catch(error => {
            console.error('Error fetching layout:', error);
            throw error;
        });
    },
    getAll: async function (limit = 25, page = 1) {
        // Fetch project details
        const project = await getProjectDetails();
        const url = project.url + `/layouts?limit=${limit}&page=${page}`;
        const apikey = project.apikey;
        const sanitizedUrl = sanitizeUrl(url);

        // Fetch all layouts
        return fetcher(`${sanitizedUrl}`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        }).catch(error => {
            console.error('Error fetching all layouts:', error);
            throw error;
        });
    },
    search: async function (search) {
        // Fetch project details
        const project = await getProjectDetails();
        const url = project.url + `/layouts?name=${search}&limit=${25}&page=${1}`;
        const apikey = project.apikey;
        const sanitizedUrl = sanitizeUrl(url);

        // Search layouts
        return fetcher(`${sanitizedUrl}`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        }).catch(error => {
            console.error('Error searching layouts:', error);
            throw error;
        });
    },
    createOrUpdate: async function (id, states) {
        // Fetch project details
        const project = await getProjectDetails();
        const url = project.url + `/layouts${id !== -1 ? '/' + id : ''}`;
        const apikey = project.apikey;
        const sanitizedUrl = sanitizeUrl(url);

        // Create or update layout
        return fetcher(`${sanitizedUrl}`, {
            method: id !== -1 ? 'PUT' : 'POST',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify({ ...states, [id !== -1 ? 'updater' : 'creator']: project.creator, _id: undefined }),
        }).catch(error => {
            console.error('Error creating or updating layout:', error);
            throw error;
        });
    },
    delete: async function (id) {
        // Fetch project details
        const project = await getProjectDetails();
        const url = `${project.url}/layouts/${id}`;
        const apikey = project.apikey;
        const sanitizedUrl = sanitizeUrl(url);

        // Delete layout
        return fetcher(`${sanitizedUrl}`, {
            method: 'DELETE',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        }).catch(error => {
            console.error('Error deleting layout:', error);
            throw error;
        });
    }
}

export default LayoutServices;