import { fetcher } from '../fetch';

const ProjectServices = {

    get: async function (id) {
        return await fetcher(`/api/projects/${id}`, {
            method: 'GET'
        });
    },

    getCookie: async function (projectId) {


        return await fetcher(`/api/projects/${projectId}/cookie`, {
            method: 'GET'
        });
    },

 

    getAll: async function (page, limit, shared = false) {
        return await fetcher(`/api/projects${shared ? '/shared' : ''}?limit=${limit}&page=${page}`, {
            method: 'GET'
        });
    },

    search: async function (search, shared = false) {

        return await fetcher(`/api/projects${shared ? '/shared' : ''}/search?search=${search}`, {
            method: 'Get',
        });
    },



    createOrUpdate: async function (id, states) {



        return fetcher(`/api/projects${id !== -1 ? '/' + id : ''}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...states }),
        });


    },

    download: async function (id, states) {

        const res = await fetcher(`/api/projects/${id}`, {
            method: 'GET'
        });

        const project = res.project;

        if (!project)
            throw new Error("Project Not Found.");

        const params = new URLSearchParams({ projectId: project._id, ...states });

        const url = project.url + `/project/download?${params.toString()}`;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        const downloadLink = document.createElement('a');
        downloadLink.href = `${sanitizedUrl}`;
        downloadLink.download = true;
        downloadLink.target = '_blank';
        downloadLink.click();



    },

    search: async function (search, page, limit) {
        const projectId = localStorage.getItem("project");

        const res = await fetcher(`/api/projects/${projectId}`, {
            method: 'GET'
        });

        const project = res.project;

        if (!project)
            throw new Error("Project Not Found.");


        return await fetcher(`${project.url}/api/search?limit=${limit}&page=${page}`, {
            method: 'POST',
            headers: {},
            headers: { 'Content-Type': 'application/json', 'x-api-key': project.apikey },
            body: JSON.stringify({ search }),
        });

    },

    
    conenction: async function (project) {
     
        return await fetcher(`${project.url}`, {
            method: 'GET',
            headers: { 'x-api-key': project.apikey },
        });

    },


    delete: function (id) {
        return fetcher(`/api/projects/${id}`, {
            method: 'DELETE'
        });
    },
}

export default ProjectServices;