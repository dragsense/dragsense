import { fetcher } from '../fetch';

const BackupServices = {

    get: function (projectId, id) {
        return fetcher(`/api/projects/${projectId}/backups/${id}`, {
            method: 'GET'
        });
    },
    getAll: function (projectId, page, limit=10) {
        return fetcher(`/api/projects/${projectId}/backups?limit=${limit}&page=${page}`, {
            method: 'GET'
        });

    },

    search: async function (projectId, search) {

        return fetcher(`/api/projects/${projectId}/backups/search?search=${search}`, {
            method: 'Get',
        });
    },


    createOrUpdate: function (projectId, id, states) {


        return fetcher(`/api/projects/${projectId}/backups${id !== -1 ?  '/' + id : ''}`, {
            method: 'POST',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...states }),
        });

    },
    install: function (projectId, id) {
        return fetcher(`/api/projects/${projectId}/backups/${id}`, {
            method: 'PATCH',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json' },
        });
    },
    delete: function (projectId, id) {
        return fetcher(`/api/projects/${projectId}/backups/${id}`, {
            method: 'DELETE',
        });
    }
}

export default BackupServices;