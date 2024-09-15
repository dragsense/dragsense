import { fetcher } from "../fetch";

// Helper function to handle fetch errors
const handleFetchError = (error) => {
  console.error("Error:", error);
  throw error;
};

// Helper function to create fetch options
const createFetchOptions = (method, headers = {}, body = null) => ({
  method,
  headers,
  body: body ? JSON.stringify(body) : null,
});

const ProjectServices = {
  // Function to get a project by id
  get: async function (id) {
    try {
      return await fetcher(`/api/projects/${id}`, createFetchOptions("GET"));
    } catch (error) {
      handleFetchError(error);
    }
  },

  // Function to get a project's cookie by project id
  getCookie: async function (projectId) {
    try {
      return await fetcher(
        `/api/projects/${projectId}/cookie`,
        createFetchOptions("GET")
      );
    } catch (error) {
      handleFetchError(error);
    }
  },

  // Function to get all projects with pagination and shared option
  getAll: async function (page, limit, shared = false) {
    try {
      return await fetcher(
        `/api/projects${shared ? "/shared" : ""}?limit=${limit}&page=${page}`,
        createFetchOptions("GET")
      );
    } catch (error) {
      handleFetchError(error);
    }
  },

  // Function to search projects with shared option
  search: async function (search, shared = false) {
    try {
      return await fetcher(
        `/api/projects${shared ? "/shared" : ""}/search?search=${search}`,
        createFetchOptions("GET")
      );
    } catch (error) {
      handleFetchError(error);
    }
  },

  // Function to create or update a project
  createOrUpdate: async function (id, states) {
    try {
      return fetcher(
        `/api/projects${id !== -1 ? "/" + id : ""}`,
        createFetchOptions(
          "POST",
          { "Content-Type": "application/json" },
          { ...states }
        )
      );
    } catch (error) {
      handleFetchError(error);
    }
  },

  // Function to download a project
  download: async function (id, name, states) {
    try {
      const params = new URLSearchParams({ projectId: id, ...states });
      const downloadLink = document.createElement("a");
      downloadLink.href = `/api/projects/download/${id}/export?${params}`;
      console.log(downloadLink.href)
      downloadLink.download = `project-${name}-${new Date().getDate()}.zip`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

    } catch (error) {
      handleFetchError(error);
    }
  },

  // Function to search a project with pagination
  search: async function (search, page, limit) {
    try {
      const projectId = localStorage.getItem("project");

      const res = await fetcher(
        `/api/projects/${projectId}`,
        createFetchOptions("GET")
      );

      const project = res.project;

      if (!project) throw new Error("Project Not Found.");

      return await fetcher(
        `${project.url}/api/search?limit=${limit}&page=${page}`,
        createFetchOptions(
          "POST",
          { "Content-Type": "application/json", "x-api-key": project.apikey },
          { search }
        )
      );
    } catch (error) {
      handleFetchError(error);
    }
  },

  // Function to connect to a project
  conenction: async function (project) {
    try {
      return await fetcher(
        `${project.url}`,
        createFetchOptions("GET", { "x-api-key": project.apikey })
      );
    } catch (error) {
      handleFetchError(error);
    }
  },

  // Function to delete a project
  delete: function (id) {
    try {
      return fetcher(`/api/projects/${id}`, createFetchOptions("DELETE"));
    } catch (error) {
      handleFetchError(error);
    }
  },
};

export default ProjectServices;
