import { fetcher } from '../fetch';



const ThemeServices = {

    getColors: async function (page = 1, limit = 25) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;
        const url = project.url + `/theme/colors?limit=${limit}&page=${page}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        });
    },

    searchColors: async function (search) {


        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;
        const url = project.url + `/theme/colors?name=${search}&limit=${25}&page=${1}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        });
    },


    addColor: async function (obj) {


        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;

        const url = project.url + `/theme/color`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'POST',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify(obj),
        });
    },
    updateColor: async function (_uid, obj) {


        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;

        const url = project.url + `/theme/color/${_uid}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'PUT',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify(obj),
        });

    },

    deleteColor: async function (_uid) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

     
        const project = response.project;
        const url = project.url + `/theme/color/${_uid}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'DELETE',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        });
    },


    getFonts: async function (page = 1, limit = 25) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });


        const project = response.project;
        const url = project.url + `/theme/fonts?limit=${limit}&page=${page}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        });


    },

    addFont: async function (obj) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;
        const url = project.url + `/theme/font`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'POST',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify(obj),
        });

   

    },
    updateFont: async function (_uid, obj) {
        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });



        const project = response.project;

        const url = project.url + `/theme/font/${_uid}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        

        return fetcher(`${sanitizedUrl}`, {
            method: 'PUT',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify(obj),
        });

    },

    deleteFont: async function (_uid) {


        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;
        const url = project.url + `/theme/font/${_uid}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'DELETE',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        });

    },

    getVariables: async function (page = 1, limit = 25) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });
        const project = response.project;
        const url = project.url + `/theme/variables?limit=${limit}&page=${page}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        });
    },

    
    searchVariables: async function (search) {


        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

      
        const project = response.project;
        const url = project.url + `/theme/variables?name=${search}&limit=${25}&page=${1}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        });

    },

    addVariable: async function (obj) {


        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;
        const url = project.url + `/theme/variable`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'POST',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify(obj),
        });
    },
    updateVariable: async function (_uid, obj) {


        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;

        const url = project.url + `/theme/variable/${_uid}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'PUT',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify(obj),
        });

    },

    deleteVariable: async function (_uid) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;
        const url = project.url + `/theme/variable/${_uid}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'DELETE',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        });

    },


    getIcons: async function (page = 1, limit = 25) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;
        const url = project.url + `/theme/icons?limit=${limit}&page=${page}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        });

    },

    addIcon: async function (obj) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });


        const project = response.project;
        const url = project.url + `/theme/icon`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'POST',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify(obj),
        });

    },
    updateIcon: async function (_uid, obj) {
        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;

        const url = project.url + `/theme/icon/${_uid}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        

        return fetcher(`${sanitizedUrl}`, {
            method: 'PUT',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify(obj),
        });
    },

    deleteIcon: async function (_id) {


        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;
        const url = project.url + `/theme/icon/${_id}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'DELETE',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        });

    },

    searchIcons: async function (search) {


        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

      
        const project = response.project;
        const url = project.url + `/theme/icons?name=${search}&limit=${25}&page=${1}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        });

    },

    getJsIndex: async function () {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;
        const url = project.url + `/theme/js`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        });
    },


    saveJsIndex: async function (states) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;
        const url = project.url + `/theme/js`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'POST',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify({...states}),
        });
    },


    getCssIndex: async function () {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;
        const url = project.url + `/theme/customCss`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
        });
    },


    saveCssIndex: async function (states) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;
        const url = project.url + `/theme/css`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'POST',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify({...states}),
        });
    },

    getStyle: async function () {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;

        return await fetcher(`${project.url}/api/theme/style`, {
            method: 'POST',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': project.apikey },
        });
    },

    getPageStyle: async function (type, _id) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;

        return await fetcher(`${project.url}/api/${type}s/${_id}/style`, {
            method: 'POST',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': project.apikey },
        });
    },


    getStyleByType: async function (elementType, media = '') {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;

        return await fetcher(`${project.url}/api/theme/style/${elementType}?media=${media}`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': project.apikey },
        });
    },



    saveOrUpdateStyles: async function (styles) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;

        return await fetcher(`${project.url}/api/theme/style`, {
            method: 'PATCH',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': project.apikey },
            body: JSON.stringify({ styles }),
        });


    },

    getAnimations: async function () {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;

        return await fetcher(`${project.url}/api/theme/animation`, {
            method: 'POST',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': project.apikey },
            body: JSON.stringify({}),
        });
    },

    getAnimationsName: async function () {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;

        return await fetcher(`${project.url}/api/theme/animation/names`, {
            method: 'GET',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': project.apikey },
        });
    },

    getAnimation: async function (animation) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;

        return await fetcher(`${project.url}/api/theme/animation/${animation}`, {
            method: 'Get',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': project.apikey },
        });
    },

    deleteAnimation: async function (animation) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;

        return await fetcher(`${project.url}/api/theme/animation/${animation}`, {
            method: 'DELETE',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': project.apikey },
        });
    },

    saveOrUpdateAnimation: async function (animations) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;

        return await fetcher(`${project.url}/api/theme/animation`, {
            method: 'PATCH',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': project.apikey },
            body: JSON.stringify({ animations }),
        });


    },



    saveStyle: async function (states) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;

        return await fetcher(`${project.url}/api/theme/styles`, {
            method: 'POST',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': project.apikey },
            body: JSON.stringify({ ...states }),
        });
    },


    getTemplates: function (API_URL, API_KEY, category = 'ALL') {
        return fetcher(`${API_URL}/api/templates?category=${category}`, {
            method: 'GET',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': API_KEY },
        });
    },

    getTemplatesCategories: async function () {


        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;


        return fetcher(`${project.url}/api/templates/category`, {
            method: 'GET',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': project.apikey },
        });
    },


    getTemplate: function (id, API_URL, API_KEY) {
        return fetcher(`${API_URL}/api/templates/${id}`, {
            method: 'GET',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': API_KEY },
        });
    },


    saveTemplate: async function (obj) {


        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;

        return fetcher(`${project.url}/api/templates`, {
            method: 'POST',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': project.apikey },
            body: JSON.stringify({ ...obj, creator: project.creator }),
        });
    },

    updateTemplate: async function (obj, id) {

        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;


        return fetcher(`${project.url}/api/templates/${id}`, {
            method: 'PATCH',
            headers: { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': project.apikey },
            body: JSON.stringify({ ...obj, updater: project.creator }),
        });
    },


    deleteTemplate: async function (id) {


        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        });

        const project = response.project;
        return fetcher(`${project.url}/api/templates/${id}`, {
            method: 'DELETE',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': project.apikey },
        });
    },
}

export default ThemeServices;