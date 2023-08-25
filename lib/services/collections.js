import { fetcher } from '../fetch';

const CollectionServices = {

    get: async function (id) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

      
        const project = response.project;
        const url = project.url + `/collections/${id}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'Get',
            headers: { 'x-api-key': apikey, "origin": 'http://localhost:3000' },
        });
    },
 
    getAll: async function (page, limit) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;
        const url = project.url + `/collections`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}?limit=${limit}&page=${page}`, {
            method: 'Get',
            headers: { 'x-api-key': apikey },
        });
    },


    search: async function (search) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;
        const url = project.url + `/collections?name=${search}&limit=${25}&page=${1}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'Get',
            headers: { 'x-api-key': apikey },
        });
    },
    clone: async function(id) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;
        const url = project.url + `/collections/duplicate/${id}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'POST',
            headers: { 'x-api-key': apikey },
            headers: { 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify({  creator: project.creator }),
        });


    },
    createOrUpdate: async function (id, states) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;
        const url = project.url + `/collections${id !== -1 ? '/' + id : ''}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: id !== -1 ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify({ ...states, _id: undefined, [id !== -1 ? 'updater' : 'creator']: project.creator }),
        });

    },


    delete: async function (id) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });
        const project = response.project;
        const url = `${project.url}/collections/${id}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');
      
        return fetcher(`${sanitizedUrl}`, {
          method: 'DELETE',
          headers: { 'x-api-key': apikey  },
        });
    },


}

export default CollectionServices;