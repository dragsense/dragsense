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

const FormServices = {

    get: async function (id) {
        // Fetch project details
        const project = await getProjectDetails();
        const url = project.url + `/forms/${id}`;
        const apikey = project.apikey;
        const sanitizedUrl = sanitizeUrl(url);

        // Fetch form details
        return fetcher(`${sanitizedUrl}`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        }).catch(error => {
            console.error('Error fetching form:', error);
            throw error;
        });
    },

    getAll: async function (page, limit) {
        // Fetch project details
        const project = await getProjectDetails();
        const url = project.url + `/forms`;
        const apikey = project.apikey;
        const sanitizedUrl = sanitizeUrl(url);

        // Fetch all forms
        return fetcher(`${sanitizedUrl}?limit=${limit}&page=${page}`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        }).catch(error => {
            console.error('Error fetching all forms:', error);
            throw error;
        });
    },

    search: async function (search) {
        // Fetch project details
        const project = await getProjectDetails();
        const url = project.url + `/forms?name=${search}&limit=${25}&page=${1}`;
        const apikey = project.apikey;
        const sanitizedUrl = sanitizeUrl(url);

        // Search forms
        return fetcher(`${sanitizedUrl}`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        }).catch(error => {
            console.error('Error searching forms:', error);
            throw error;
        });
    },

    clone: async function(id) {
        // Fetch project details
        const project = await getProjectDetails();
        const url = project.url + `/forms/duplicate/${id}`;
        const apikey = project.apikey;
        const sanitizedUrl = sanitizeUrl(url);

        // Clone form
        return fetcher(`${sanitizedUrl}`, {
            method: 'POST',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify({  creator: project.creator }),
        }).catch(error => {
            console.error('Error cloning form:', error);
            throw error;
        });
    },

    createOrUpdate: async function(id, states) {
        // Fetch project details
        const project = await getProjectDetails();
        const url = project.url + `/forms${id !== -1 ? '/' + id : ''}`;
        const apikey = project.apikey;
        const sanitizedUrl = sanitizeUrl(url);

        // Create or update form
        return fetcher(`${sanitizedUrl}`, {
            method: id !== -1 ? 'PUT' : 'POST',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify({ ...states, _id: undefined, [id !== -1 ? 'updater' : 'creator']: project.creator }),
        }).catch(error => {
            console.error('Error creating or updating form:', error);
            throw error;
        });
    },

    submit: async function(id, states) {
        // Fetch project details
        const project = await getProjectDetails();

        // Submit form
        return fetcher(`${project.url}/api/forms/${id}/submit`, {
            method: 'POST',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': project.apikey },
            body: JSON.stringify({ states }),
        }).catch(error => {
            console.error('Error submitting form:', error);
            throw error;
        });
    },

    delete: async function (id) {
        // Fetch project details
        const project = await getProjectDetails();
        const url = `${project.url}/forms/${id}`;
        const apikey = project.apikey;
        const sanitizedUrl = sanitizeUrl(url);
      
        // Delete form
        return fetcher(`${sanitizedUrl}`, {
          method: 'DELETE',
          headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey  },
        }).catch(error => {
            console.error('Error deleting form:', error);
            throw error;
        });
    },
}

export default FormServices;