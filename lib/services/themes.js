import { fetcher } from '../fetch';

const ThemesServices = {

    getAll: async function (projectId, page, limit=10) {
        return await fetcher(`/api/projects/${projectId}/themes?limit=${limit}&page=${page}`, {
            method: 'GET'
        });

    },

    getCurrentTheme: async function (projectId, page, limit=10) {
        return await fetcher(`/api/projects/${projectId}/currenttheme`, {
            method: 'GET'
        });

    },

    getAllThemes: async function (platform, page, limit=10) {
        return await fetcher(`/api/projects/themes?platform=${platform}&limit=${limit}&page=${page}`, {
            method: 'GET'
        });

    },

    searchThemes: async function (platform, search, page, limit=10) {

        return await fetcher(`/api/projects/themes/search?platform=${platform}&search=${search}&limit=${limit}&page=${page}`, {
            method: 'Get',
        });
    },


    search: async function (projectId, search, page, limit=10) {

        return await fetcher(`/api/projects/${projectId}/themes/search?search=${search}&limit=${limit}&page=${page}`, {
            method: 'Get',
        });
    },


    create: function (projectId, id) {
        return fetcher(`/api/projects/${projectId}/themes`, {
            method: 'POST',
            headers: { 'ngrok-skip-browser-warning': true, 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json' },
            body: JSON.stringify({id}),

        });

    },
    install: function (projectId, id) {
        return fetcher(`/api/projects/${projectId}/themes/${id}`, {
            method: 'POST',
            headers: { 'ngrok-skip-browser-warning': true, 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json' },
        });

    },


    delete: function (projectId, id) {
        return fetcher(`/api/projects/${projectId}/themes/${id}`, {
            method: 'DELETE',
        });
    }
}

export default ThemesServices;