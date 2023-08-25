import { fetcher } from '../fetch';

const DocumentServices = {


    get: async function (collectionId, id, _form = false) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });


        const project = response.project;
        const url = project.url + `/documents/${collectionId}/${id}?form=${_form}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'Get',
            headers: { 'x-api-key': apikey, "origin": 'http://localhost:3000' },
        });
    },

    getAll: async function (collectionId, page, limit, form=false) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

    
        const project = response.project;
        const url = project.url + `/documents/${collectionId}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}?form=${form}&limit=${limit}&page=${page}`, {
            method: 'Get',
            headers: { 'x-api-key': apikey },
        });
    },

    
    getAllWithFilters: async function (collectionId, states, page = 1, limit=25) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;


        return fetcher(`${project.url}/api/documents/${collectionId}/document?limit=${limit}&page=${page}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': project.apikey },
            body: JSON.stringify(states)
        });
    },

    
    getWithFilters: async function (collectionId, states) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;


        return fetcher(`${project.url}/api/documents/${collectionId}/document`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'x-api-key': project.apikey },
            body: JSON.stringify(states)
        });
    },


    searchWithFilters: async function (collectionId, search, states) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;


        return fetcher(`${project.url}/api/documents/${collectionId}/search?search=${search}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'x-api-key': project.apikey },
            body: JSON.stringify(states)
        });
    },

    

    search: async function (collectionId, search, form=false) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });



        const project = response.project;
        const url = project.url + `/documents/${collectionId}?name=${search}&limit=${25}&page=${1}&form=${form}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'Get',
            headers: { 'x-api-key': apikey },
        });

    },

    clone: async function(collectionId, id, form=false) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

   

        const project = response.project;
        const url = project.url + `/documents/${collectionId}/duplicate/${id}?form=${form}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'POST',
            headers: { 'x-api-key': apikey },
            headers: { 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify({  creator: project.creator }),
        });


    },
    
    createOrUpdate: async function(collectionId, id, states, form=false) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });


        const project = response.project;
        const url = project.url + `/documents/${collectionId}${id !== -1 ? '/' + id : ''}?form=${form}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: id !== -1 ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify({ ...states, _id: undefined, [id !== -1 ? 'updater' : 'creator']: project.creator }),
        });



    },

    delete: async function (collectionId, id, form=false) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;
        const url = `${project.url}/documents/${collectionId}/${id}?form=${form}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');
      
        return fetcher(`${sanitizedUrl}`, {
          method: 'DELETE',
          headers: { 'x-api-key': apikey  },
        });
    },
}

export default DocumentServices;