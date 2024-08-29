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

const MediaServices = {

    get: async function (id) {
        // Fetch project details
        const project = await getProjectDetails();
        const url = sanitizeUrl(project.url + `/media/${id}`);
        const apikey = project.apikey;

        return fetcher(`${url}`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        }).catch(error => {
            console.error('Error fetching media:', error);
            throw error;
        });
    },

    getAll: async function (type, page, limit = 25,) {

        // Fetch project details
        const project = await getProjectDetails();
        const url = sanitizeUrl(project.url + `/media?type=${type}&limit=${limit}&page=${page}`);
        const apikey = project.apikey;

        return fetcher(`${url}`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        }).catch(error => {
            console.error('Error fetching all media:', error);
            throw error;
        });
    },

    search: async function (type, search) {

        // Fetch project details
        const project = await getProjectDetails();
        const url = sanitizeUrl(project.url + `/media?name=${search}&type=${type}&limit=${25}&page=${1}`);
        const apikey = project.apikey;

        return fetcher(`${url}`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        }).catch(error => {
            console.error('Error searching media:', error);
            throw error;
        });
    },

    upload: async function (type, formData, onProgress,) {
        // Fetch project details
        const project = await getProjectDetails();
        const url = sanitizeUrl(project.url + `/media?type=${type}`);
        const apikey = project.apikey;

        return await fetcher(`${url}`, {
            method: 'POST',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
            body: formData,
            onProgress: ({ total, loaded }) => {
                if (onProgress) {
                    const progress = Math.round((loaded / total) * 100);
                    onProgress({ percent: progress });
                }
            }
        }).catch(error => {
            console.error('Error uploading media:', error);
            throw error;
        });
    },

    update: async function (id, states) {
        // Fetch project details
        const project = await getProjectDetails();
        const url = sanitizeUrl(project.url + `/media${id !== -1 ? '/' + id : ''}`);
        const apikey = project.apikey;

        return fetcher(`${url}`, {
            method: 'PUT',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify({ ...states }),
        }).catch(error => {
            console.error('Error updating media:', error);
            throw error;
        });
    },

    delete: async function (id) {
        // Fetch project details
        const project = await getProjectDetails();
        const url = sanitizeUrl(`${project.url}/media/${id}`);
        const apikey = project.apikey;

        return fetcher(`${url}`, {
            method: 'DELETE',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        }).catch(error => {
            console.error('Error deleting media:', error);
            throw error;
        });
    },

}

export default MediaServices;