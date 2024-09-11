import { fetcher } from '../fetch';

// Helper function to get project details
const getProjectDetails = async () => {
    const projectId = localStorage.getItem("project");
    const response = await fetcher('/api/projects/' + projectId, {
        method: 'GET'
    });
    return response.project;
}

// Helper function to sanitize URL
const sanitizeUrl = (url) => {
    return url.replace(/([^:]\/)\/+/g, '$1');
}

const DocumentServices = {

    get: async function (collectionId, id, _form = false) {
        try {
            const project = await getProjectDetails();
            const url = project.url + `/documents/${collectionId}/${id}?form=${_form}`;
            const apikey = project.apikey;
            const sanitizedUrl = sanitizeUrl(url);

            return fetcher(`${sanitizedUrl}`, {
                method: 'Get',
                headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
            });
        } catch (error) {
            console.error(error);
        }
    },

    getAll: async function (collectionId, page, limit, form=false) {
        try {
            const project = await getProjectDetails();
            const url = project.url + `/documents/${collectionId}`;
            const apikey = project.apikey;
            const sanitizedUrl = sanitizeUrl(url);

            return fetcher(`${sanitizedUrl}?form=${form}&limit=${limit}&page=${page}`, {
                method: 'Get',
                headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
            });
        } catch (error) {
            console.error(error);
        }
    },

    getAllWithFilters: async function (collectionId, states, page = 1, limit=25) {
        try {
            const project = await getProjectDetails();

            return fetcher(`${project.url}/api/documents/${collectionId}/document?limit=${limit}&page=${page}`, {
                method: 'POST',
                headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': project.apikey },
                body: JSON.stringify(states)
            });
        } catch (error) {
            console.error(error);
        }
    },

    getWithFilters: async function (collectionId, states) {
        try {
            const project = await getProjectDetails();

            return fetcher(`${project.url}/api/documents/${collectionId}/document`, {
                method: 'PATCH',
                headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': project.apikey },
                body: JSON.stringify(states)
            });
        } catch (error) {
            console.error(error);
        }
    },

    searchWithFilters: async function (collectionId, search, states) {
        try {
            const project = await getProjectDetails();

            return fetcher(`${project.url}/api/documents/${collectionId}/search?search=${search}`, {
                method: 'PATCH',
                headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': project.apikey },
                body: JSON.stringify(states)
            });
        } catch (error) {
            console.error(error);
        }
    },

    search: async function (collectionId, search, form=false) {
        try {
            const project = await getProjectDetails();
            const url = project.url + `/documents/${collectionId}?name=${search}&limit=${25}&page=${1}&form=${form}`;
            const apikey = project.apikey;
            const sanitizedUrl = sanitizeUrl(url);

            return fetcher(`${sanitizedUrl}`, {
                method: 'Get',
                headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
            });
        } catch (error) {
            console.error(error);
        }
    },

    clone: async function(collectionId, id, form=false) {
        try {
            const project = await getProjectDetails();
            const url = project.url + `/documents/${collectionId}/duplicate/${id}?form=${form}`;
            const apikey = project.apikey;
            const sanitizedUrl = sanitizeUrl(url);

            return fetcher(`${sanitizedUrl}`, {
                method: 'POST',
                headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
                headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': apikey },
                body: JSON.stringify({  creator: project.creator }),
            });
        } catch (error) {
            console.error(error);
        }
    },

    createOrUpdate: async function(collectionId, id, states, form=false) {
        try {
            const project = await getProjectDetails();
            const url = project.url + `/documents/${collectionId}${id !== -1 ? '/' + id : ''}?form=${form}`;
            const apikey = project.apikey;
            const sanitizedUrl = sanitizeUrl(url);

            return fetcher(`${sanitizedUrl}`, {
                method: id !== -1 ? 'PUT' : 'POST',
                headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': apikey },
                body: JSON.stringify({ ...states, _id: undefined, [id !== -1 ? 'updater' : 'creator']: project.creator }),
            });
        } catch (error) {
            console.error(error);
        }
    },

    delete: async function (collectionId, id, form=false) {
        try {
            const project = await getProjectDetails();
            const url = `${project.url}/documents/${collectionId}/${id}?form=${form}`;
            const apikey = project.apikey;
            const sanitizedUrl = sanitizeUrl(url);

            return fetcher(`${sanitizedUrl}`, {
              method: 'DELETE',
              headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey  },
            });
        } catch (error) {
            console.error(error);
        }
    },
}

export default DocumentServices;