import { fetcher } from '../fetch';

const ThemesServices = {

    get: async function (projectId, id) {
        return await fetcher(`/api/projects/themes/${id}`, {
            method: 'GET'
        });
    },
    getAll: async function (projectId, page, limit=10) {
        return await fetcher(`/api/projects/${projectId}/themes?limit=${limit}&page=${page}`, {
            method: 'GET'
        });

    },

    search: async function (projectId, search) {

        return await fetcher(`/api/projects/${projectId}/themes/search?search=${search}`, {
            method: 'Get',
        });
    },


    create: function (projectId, id,) {
        return fetcher(`/api/projects/${projectId}/themes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id}),

        });

    },
    install: function (projectId, id) {
        return fetcher(`/api/projects/${projectId}/themes/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

    },

    download: function (projectId, id) {
        return fetcher(`/api/projects/${projectId}/themes/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
        });
    },

    delete: function (projectId, id) {
        return fetcher(`/api/projects/${projectId}/themes/${id}`, {
            method: 'DELETE',
        });
    }
}

export default ThemesServices;