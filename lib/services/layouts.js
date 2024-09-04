import { message } from 'antd';
import { fetcher } from '../fetch';

// Helper function to get project details
export const getProjectDetails = async () => {
    const projectId = localStorage.getItem("project");
    const response = await fetcher('/api/projects/' + projectId, {
        method: 'GET'
    }).catch(error => {
        message.error('Error fetching project details:', error);
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

        const project = await getProjectDetails();
        const url = sanitizeUrl(project.url + `/layouts/${id}`);
        const apikey = project.apikey;

        return fetcher(`${url}`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true,
                'x-api-key': apikey,
                "ngrok-skip-browser-warning": "any"

            }
        }).catch(error => {
            console.error('Error getting layout:', error);
            throw error;
        });
    },
    getAll: async function (layout, limit) {

        const project = await getProjectDetails();
        const url = sanitizeUrl(project.url + `/layouts`);
        const apikey = project.apikey;

        return fetcher(`${url}?limit=${limit}&layout=${layout}`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        }).catch(error => {
            console.error('Error getting all layouts:', error);
            throw error;
        });
    },

    search: async function (search) {

        const project = await getProjectDetails();
        const url = sanitizeUrl(project.url + `/layouts?name=${search}&limit=${25}&layout=${1}`);
        const apikey = project.apikey;

        return fetcher(`${url}`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        }).catch(error => {
            console.error('Error searching layouts:', error);
            throw error;
        });
    },

    createOrUpdate: async function (id, states, withTemplate) {

        const project = await getProjectDetails();
        const url = sanitizeUrl(project.url + `/layouts${id !== -1 ? '/' + id : `?withTemplate=${withTemplate}`}`);
        const apikey = project.apikey;

        return fetcher(`${url}`, {
            method: id !== -1 ? 'PUT' : 'POST',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify({ ...states, _id: undefined, [id !== -1 ? 'updater' : 'creator']: project.creator }),
        }).catch(error => {
            console.error('Error creating or updating layout:', error);
            throw error;
        });


    },

    clone: async function (id) {

        const project = await getProjectDetails();
        const url = sanitizeUrl(project.url + `/layouts/duplicate/${id}`);
        const apikey = project.apikey;

        return fetcher(`${url}`, {
            method: 'POST',

            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify({ creator: project.creator }),
        }).catch(error => {
            console.error('Error cloning layout:', error);
            throw error;
        });


    },




    delete: async function (id) {
        const project = await getProjectDetails();
        const url = sanitizeUrl(`${project.url}/layouts/${id}`);
        const apikey = project.apikey;

        return fetcher(`${url}`, {
            method: 'DELETE',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        }).catch(error => {
            console.error('Error deleting layout:', error);
            throw error;
        });
    }
}

export default LayoutServices;