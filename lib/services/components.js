import { fetcher } from '../fetch';

// Helper function to get project details
const getProjectDetails = async () => {
    const projectId = localStorage.getItem("project");
    const response = await fetcher('/api/projects/' + projectId, {
        method: 'GET'
    });
    if (!response.project) {
        throw new Error('Project not found');
    }
    return response.project;
}

// Helper function to sanitize URL
const sanitizeUrl = (url) => {
    return url.replace(/([^:]\/)\/+/g, '$1');
}

const ComponentServices = {

    get: async function (id) {
        const project = await getProjectDetails();
        const url = sanitizeUrl(project.url + `/components/${id}`);
        const apikey = project.apikey;

        return fetcher(`${url}`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey, "origin": 'http://localhost:3000' },
        });
    },
    getAll: async function (page, limit) {
        const project = await getProjectDetails();
        const url = sanitizeUrl(project.url + `/components`);
        const apikey = project.apikey;

        return fetcher(`${url}?limit=${limit}&page=${page}`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        });
    },
    getPaths: async function () {
        const project = await getProjectDetails();

        return fetcher(`${project.url}/api/components/path`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true,'x-api-key': project.apikey },
        });
    },
    search: async function (search) {
        const project = await getProjectDetails();
        const url = sanitizeUrl(project.url + `/components?name=${search}&limit=${25}&page=${1}`);
        const apikey = project.apikey;

        return fetcher(`${url}`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        });
    },
    clone: async function(id) {
        const project = await getProjectDetails();
        const url = sanitizeUrl(project.url + `/components/duplicate/${id}`);
        const apikey = project.apikey;

        return fetcher(`${url}`, {
            method: 'POST',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify({  creator: project.creator }),
        });
    },
    createOrUpdate: async function(id, states) {
        const project = await getProjectDetails();
        const url = sanitizeUrl(project.url + `/components${id !== -1 ? '/' + id : ''}`);
        const apikey = project.apikey;

        return fetcher(`${url}`, {
            method: id !== -1 ? 'PUT' : 'POST',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify({ ...states, _id: undefined, [id !== -1 ? 'updater' : 'creator']: project.creator }),
        });
    },
    delete: async function (id) {
        const project = await getProjectDetails();
        const url = sanitizeUrl(`${project.url}/components/${id}`);
        const apikey = project.apikey;
      
        return fetcher(`${url}`, {
          method: 'DELETE',
          headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey  },
        });
    },
}

export default ComponentServices;