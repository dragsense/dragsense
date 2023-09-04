import { fetcher } from '../fetch';

const UserServices = {

    get: function (projectId, id) {
        return fetcher(`/api/projects/${projectId}/users/${id}`, {
            method: 'GET'
        });
    },

   
    getAll: function (projectId, page, limit = 10) {
        return fetcher(`/api/projects/${projectId}/users?limit=${limit}&page=${page}`, {
            method: 'GET'
        });

    },



    createOrUpdate: function (projectId, id, states) {
        return fetcher(`/api/projects/${projectId}/users${id !== -1 ? '/' + id : ''}`, {
            method: 'POST',
            headers: { 'ngrok-skip-browser-warning': true, 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...states }),
        });

    },



    delete: function (projectId, id) {
        return fetcher(`/api/projects/${projectId}/users/${id}`, {
            method: 'DELETE',
        });
    }
}

export default UserServices;