import { fetcher } from '../fetch';



const LayoutServices = {

    get: async function (id) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;
        const url = project.url + `/layouts/${id}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        });
    },
    getAll: async function (limit = 25, page = 1) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;
        const url = project.url + `/layouts?limit=${limit}&page=${page}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        });
    },



    search: async function (search) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;
        const url = project.url + `/layouts?name=${search}&limit=${25}&page=${1}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        });
    },

    createOrUpdate: async function (id, states) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;
        const url = project.url + `/layouts${id !== -1 ? '/' + id : ''}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: id !== -1 ? 'PUT' : 'POST',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify({ ...states, [id !== -1 ? 'updater' : 'creator']: project.creator, _id: undefined }),
        });


    },


    // add: function (obj, API_URL, API_KEY) {
    //     return fetcher(`${API_URL}/api/layouts`, {
    //         method: 'POST',
    //         headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': API_KEY },
    //         body: JSON.stringify(obj),
    //     });

    // },
    // update: function (id, obj, API_URL, API_KEY) {
    //     return fetcher(`${API_URL}/api/layouts/${id}`, {
    //         method: 'PATCH',
    //         headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': API_KEY },
    //         body: JSON.stringify(obj),
    //     });
    // },
    delete: async function (id) {
        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;
        const url = `${project.url}/layouts/${id}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');


        return fetcher(`${sanitizedUrl}`, {
            method: 'DELETE',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        });
    }
}

export default LayoutServices;