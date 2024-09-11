import { fetcher } from '../fetch';

// Helper function to handle fetch errors
const handleErrors = response => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

// Helper function to build the API endpoint
const sanitizeUrl = (url) => {
    return url.replace(/([^:]\/)\/+/g, '$1');
}

const CollectionServices = {

    get: async function (id) {

        // Fetch project details
        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        })

        // Construct the URL for the collection
        const project = response.project;
        const url = sanitizeUrl(`${project.url}/collections/${id}`);
        const apikey = project.apikey;

        // Fetch the collection
        return fetcher(url, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        })
    },

    getAll: async function (page, limit) {

        // Fetch project details
        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        })

        // Construct the URL for the collections
        const project = response.project;
        const url = sanitizeUrl(`${project.url}/collections?limit=${limit}&page=${page}`);
        const apikey = project.apikey;

        // Fetch all collections
        return fetcher(url, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        })
    },

    search: async function (search) {

        // Fetch project details
        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        })

        // Construct the URL for the search
        const project = response.project;
        const url = sanitizeUrl(`${project.url}/collections?name=${search}&limit=${25}&page=${1}`);
        const apikey = project.apikey;

        // Perform the search
        return fetcher(url, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        })
    },

    clone: async function(id) {

        // Fetch project details
        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        })

        // Construct the URL for the clone
        const project = response.project;
        const url = sanitizeUrl(`${project.url}/collections/duplicate`);
        const apikey = project.apikey;

        // Clone the collection
        return fetcher(url, {
            method: 'POST',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify({  creator: project.creator }),
        })
    },

    createOrUpdate: async function (id, states) {

        // Fetch project details
        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        })

        // Construct the URL for the create or update
        const project = response.project;
        const url = sanitizeUrl(`${project.url}/collections/${id !== -1 ? id : ''}`);

        const apikey = project.apikey;

        // Create or update the collection
        return fetcher(url, {
            method: id !== -1 ? 'PUT' : 'POST',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify({ ...states, _id: undefined, [id !== -1 ? 'updater' : 'creator']: project.creator }),
        })
    },

    delete: async function (id) {

        // Fetch project details
        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        })

        // Construct the URL for the delete
        const project = response.project;
        const url = sanitizeUrl(`${project.url}/collections/${id}`);
        const apikey = project.apikey;

        // Delete the collection
        return fetcher(url, {
          method: 'DELETE',
          headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey  },
        })
    },
}

export default CollectionServices;