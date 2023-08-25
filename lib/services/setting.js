import { fetcher } from '../fetch';

const SettingServices = {

    get: async function () {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;
        const url = project.url + `/settings`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'Get',
            headers: { 'x-api-key': apikey },
        });
    },


    createOrUpdate: async function (states) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });
        
        const project = response.project;
        const url = project.url + `/settings`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');


        return fetcher(`${sanitizedUrl}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify({ ...states, _id: project._id }),
        });


    },



}

export default SettingServices;