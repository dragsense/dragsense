import { fetcher } from '../fetch';



const ThemeServices = {

    // Fetch project details
    getProjectDetails: async function () {
        const projectId = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + projectId, {
            method: 'GET'
        }).catch(error => {
            console.error('Error:', error);
            throw error;
        });
        return response.project;
    },

    // Construct and sanitize URL
    constructUrl: function (project, endpoint) {
        const url = project.url + endpoint;
        return url.replace(/([^:]\/)\/+/g, '$1');
    },

    // Fetch data from the server
    fetchData: async function (url, method, headers, body) {
        return await fetcher(url, {
            method: method,
            headers: headers,
            body: JSON.stringify(body),
        }).catch(error => {
            console.error('Error:', error);
            throw error;
        });
    },

    getColors: async function (page = 1, limit = 25) {
        const project = await this.getProjectDetails();
        const url = this.constructUrl(project, `/theme/colors?limit=${limit}&page=${page}`);
        return this.fetchData(url, 'Get', { 'ngrok-skip-browser-warning': true, 'x-api-key': project.apikey });
    },

    searchColors: async function (search) {
        const project = await this.getProjectDetails();
        const url = this.constructUrl(project, `/theme/colors?name=${search}&limit=${25}&page=${1}`);
        return this.fetchData(url, 'Get', { 'ngrok-skip-browser-warning': true, 'x-api-key': project.apikey });
    },

    addColor: async function (obj) {
        const project = await this.getProjectDetails();
        const url = this.constructUrl(project, `/theme/color`);
        return this.fetchData(url, 'POST', { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': project.apikey }, obj);
    },

    updateColor: async function (_uid, obj) {
        const project = await this.getProjectDetails();
        const url = this.constructUrl(project, `/theme/color/${_uid}`);
        return this.fetchData(url, 'PUT', { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': project.apikey }, obj);
    },

    deleteColor: async function (_uid) {
        const project = await this.getProjectDetails();
        const url = this.constructUrl(project, `/theme/color/${_uid}`);
        return this.fetchData(url, 'DELETE', { 'ngrok-skip-browser-warning': true, 'x-api-key': project.apikey });
    },


    // Fetch fonts with pagination
    getFonts: async function (page = 1, limit = 25) {
        const project = await this.getProjectDetails();
        const url = this.constructUrl(project, `/theme/fonts?limit=${limit}&page=${page}`);
        return this.fetchData(url, 'Get', { 'ngrok-skip-browser-warning': true, 'x-api-key': project.apikey });
    },

    // Add a new font
    addFont: async function (obj) {
        const project = await this.getProjectDetails();
        const url = this.constructUrl(project, `/theme/font`);
        return this.fetchData(url, 'POST', { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': project.apikey }, obj);
    },

    // Update a specific font
    updateFont: async function (_uid, obj) {
        const project = await this.getProjectDetails();
        const url = this.constructUrl(project, `/theme/font/${_uid}`);
        return this.fetchData(url, 'PUT', { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': project.apikey }, obj);
    },

    // Delete a specific font
    deleteFont: async function (_uid) {
        const project = await this.getProjectDetails();
        const url = this.constructUrl(project, `/theme/font/${_uid}`);
        return this.fetchData(url, 'DELETE', { 'ngrok-skip-browser-warning': true, 'x-api-key': project.apikey });
    },

    // Fetch variables with pagination
    getVariables: async function (page = 1, limit = 25) {
        const project = await this.getProjectDetails();
        const url = this.constructUrl(project, `/theme/variables?limit=${limit}&page=${page}`);
        return this.fetchData(url, 'Get', { 'ngrok-skip-browser-warning': true, 'x-api-key': project.apikey });
    },

    // Search variables
    searchVariables: async function (search) {
        const project = await this.getProjectDetails();
        const url = this.constructUrl(project, `/theme/variables?name=${search}&limit=${25}&page=${1}`);
        return this.fetchData(url, 'Get', { 'ngrok-skip-browser-warning': true, 'x-api-key': project.apikey });
    },

    // Add a new variable
    addVariable: async function (obj) {
        const project = await this.getProjectDetails();
        const url = this.constructUrl(project, `/theme/variable`);
        return this.fetchData(url, 'POST', { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': project.apikey }, obj);
    },

    // Update a specific variable
    updateVariable: async function (_uid, obj) {
        const project = await this.getProjectDetails();
        const url = this.constructUrl(project, `/theme/variable/${_uid}`);
        return this.fetchData(url, 'PUT', { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': project.apikey }, obj);
    },

    // Delete a specific variable
    deleteVariable: async function (_uid) {
        const project = await this.getProjectDetails();
        const url = this.constructUrl(project, `/theme/variable/${_uid}`);
        return this.fetchData(url, 'DELETE', { 'ngrok-skip-browser-warning': true, 'x-api-key': project.apikey });
    },


    // Fetch icons with pagination
    getIcons: async function (page = 1, limit = 25) {
        const project = await this.getProjectDetails();
        const url = this.constructUrl(project, `/theme/icons?limit=${limit}&page=${page}`);
        return this.fetchData(url, 'Get', { 'ngrok-skip-browser-warning': true, 'x-api-key': project.apikey });
    },

    // Add a new icon
    addIcon: async function (obj) {
        const project = await this.getProjectDetails();
        const url = this.constructUrl(project, `/theme/icon`);
        return this.fetchData(url, 'POST', { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': project.apikey }, obj);
    },

    // Update a specific icon
    updateIcon: async function (_uid, obj) {
        const project = await this.getProjectDetails();
        const url = this.constructUrl(project, `/theme/icon/${_uid}`);
        return this.fetchData(url, 'PUT', { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': project.apikey }, obj);
    },

    // Delete a specific icon
    deleteIcon: async function (_id) {
        const project = await this.getProjectDetails();
        const url = this.constructUrl(project, `/theme/icon/${_id}`);
        return this.fetchData(url, 'DELETE', { 'ngrok-skip-browser-warning': true, 'x-api-key': project.apikey });
    },

    // Search icons
    searchIcons: async function (search) {
        const project = await this.getProjectDetails();
        const url = this.constructUrl(project, `/theme/icons?name=${search}&limit=${25}&page=${1}`);
        return this.fetchData(url, 'Get', { 'ngrok-skip-browser-warning': true, 'x-api-key': project.apikey });
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

    // Fetch and save JS index
    saveJsIndex: async function (states) {
        try {
            const project = await this.getProjectDetails();
            const url = this.constructUrl(project, `/theme/js`);

            return this.fetchData(url, 'POST', { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': project.apikey }, states);
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Fetch CSS index
    getCssIndex: async function () {
        try {
            const project = await this.getProjectDetails();
            const url = this.constructUrl(project, `/theme/customCss`);

            return this.fetchData(url, 'Get', { 'ngrok-skip-browser-warning': true, 'x-api-key': project.apikey });
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Fetch and save CSS index
    saveCssIndex: async function (states) {
        try {
            const project = await this.getProjectDetails();
            const url = this.constructUrl(project, `/theme/css`);

            return this.fetchData(url, 'POST', { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': project.apikey }, states);
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },



    // Fetch templates based on category
    getTemplates: async function (category = 'ALL') {
        try {
            const project = await this.getProjectDetails();
            const url = this.constructUrl(project, `/templates?category=${category}`);
            return this.fetchData(url, 'GET',
                { 'ngrok-skip-browser-warning': true, 'x-api-key': project.apikey });


        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Fetch template categories
    getTemplatesCategories: async function () {
        try {
            const project = await this.getProjectDetails();
            const url = this.constructUrl(project, `/api/templates/category`);
            return this.fetchData(url, 'GET', { 'ngrok-skip-browser-warning': true, 'x-api-key': project.apikey });
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Fetch a specific template
    getTemplate: async function (id) {
        try {
            const project = await this.getProjectDetails();
            const url = this.constructUrl(project, `/api/templates/${id}`);
            return this.fetchData(url, 'GET', { 'ngrok-skip-browser-warning': true, 'x-api-key': project.apikey });
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Save a template
    saveTemplate: async function (obj) {
        try {
            const project = await this.getProjectDetails();
            const url = this.constructUrl(project, `/api/templates`);
            return this.fetchData(url, 'POST', { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': project.apikey }, { ...obj, creator: project.creator });
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Update a template
    updateTemplate: async function (obj, id) {
        try {
            const project = await this.getProjectDetails();
            const url = this.constructUrl(project, `/api/templates/${id}`);
            return this.fetchData(url, 'PATCH', { 'ngrok-skip-browser-warning': true, 'Content-Type': 'application/json', 'x-api-key': project.apikey }, { ...obj, updater: project.creator });
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Delete a template
    deleteTemplate: async function (id) {
        try {
            const project = await this.getProjectDetails();
            const url = this.constructUrl(project, `/api/templates/${id}`);
            return this.fetchData(url, 'DELETE', { 'ngrok-skip-browser-warning': true, 'x-api-key': project.apikey });
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },
}

export default ThemeServices;