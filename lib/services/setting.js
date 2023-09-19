import { fetcher } from '../fetch';

// Helper function to handle fetch errors
const handleFetchError = (error) => {
    console.error('Error:', error);
    throw error;
}

// Helper function to sanitize URL
const sanitizeUrl = (url) => {
    return url.replace(/([^:]\/)\/+/g, '$1');
}

// Helper function to get project details
const getProjectDetails = async (projectId) => {
    try {
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });
        return response.project;
    } catch (error) {
        handleFetchError(error);
    }
}

const SettingServices = {

    get: async function () {

        // Get project ID from local storage
        const projectId = localStorage.getItem("project");

        // Fetch project details
        const project = await getProjectDetails(projectId);

        // Construct and sanitize URL
        const url = sanitizeUrl(project.url + `/settings`);

        // Fetch settings
        try {
            return await fetcher(url, {
                method: 'GET',
                headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': project.apikey },
            });
        } catch (error) {
            handleFetchError(error);
        }
    },

    createOrUpdate: async function (states) {

        // Get project ID from local storage
        const projectId = localStorage.getItem("project");

        // Fetch project details
        const project = await getProjectDetails(projectId);

        // Construct and sanitize URL
        const url = sanitizeUrl(project.url + `/settings`);

        // Update settings
        try {
            return await fetcher(url, {
                method: 'POST',
                headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': project.apikey },
                body: JSON.stringify({ ...states, _id: project._id }),
            });
        } catch (error) {
            handleFetchError(error);
        }
    },
}

export default SettingServices;