
import PageServices from "../services/pages";
import { storeData, storePage, STYLE_STORE_NAME, clearStore, getAllData, getAllCssData } from './db';
import { fetcher } from "../fetch";

export const loadPage = async (page, type, dispatch, clear = true) => {

    const projectId = localStorage.getItem("project");
    const response = await fetcher('/api/projects/' + projectId, {
        method: 'GET'
    });


    const project = response.project;
    await loadStyles(project, page, type, dispatch, clear)
    await loadElements(project, page, type, dispatch, clear);


}

export const loadWithoutStyle = async (page, type, dispatch, clear = true) => {

    const projectId = localStorage.getItem("project");
    const response = await fetcher('/api/projects/' + projectId, {
        method: 'GET'
    });


    const project = response.project;
    await loadElements(project, page, type, dispatch, clear);


}

export const loadElements = async (project, page, type, dispatch, clear) => {



    const stream = new ReadableStream({
        start(controller) {
            fetch(`${project.url}/api/${type}s/${page._id}`, {
                headers: { 'x-api-key': project.apikey },

            })
                .then(response => {
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();

                    function processChunk(chunk) {


                        const decodedChunk = decoder.decode(chunk.value, { stream: true });
                        controller.enqueue(decodedChunk);
                        if (chunk.done) {


                            controller.close();
                            return;
                        }
                        reader.read().then(processChunk);
                    }


                    reader.read().then(processChunk);
                })
                .catch(error => {
                    controller.error(error);
                    dispatch({ type: 'error', error: error?.message || 'Something went wrong.' });

                });
        }
    }, { readableStrategy: { highWaterMark: 1 } });


    const jsonStream = new TransformStream({
        start(controller) {
            this.buffer = '';
        },
        transform(chunk, controller) {
            this.buffer += chunk;
            const lines = this.buffer.split('\n');
            this.buffer = lines.pop();

            for (const line of lines) {
                const parsedData = JSON.parse(line);
                controller.enqueue(parsedData);

            }
        },
        flush(controller) {
            if (this.buffer) {

                const parsedData = JSON.parse(this.buffer);
                controller.enqueue(parsedData);
            }
        }
    });

    const reader = stream.pipeThrough(jsonStream).getReader();
    await (async function () {

        if(clear)
        clearStore();

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }

            await storePage(value);
        }


    })();


}


export const loadStyles = async (project, page, type, dispatch, clear) => {


    const stream = new ReadableStream({
        start(controller) {
            fetch(`${project.url}/api/${type}s/${page._id}/style`, {
                headers: { 'x-api-key': project.apikey },

            })
                .then(response => {
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();

                    function processChunk(chunk) {


                        const decodedChunk = decoder.decode(chunk.value, { stream: true });
                        controller.enqueue(decodedChunk);
                        if (chunk.done) {


                            controller.close();
                            return;
                        }
                        reader.read().then(processChunk);
                    }


                    reader.read().then(processChunk);
                })
                .catch(error => {
                    controller.error(error);


                    dispatch({ type: 'error', error: error?.message || 'Something went wrong.' });

                });
        }
    }, { readableStrategy: { highWaterMark: 1 } });


    const jsonStream = new TransformStream({
        start(controller) {
            this.buffer = '';
        },
        transform(chunk, controller) {
            this.buffer += chunk;
            const lines = this.buffer.split('\n');
            this.buffer = lines.pop();

            for (const line of lines) {
                const parsedData = JSON.parse(line);
                controller.enqueue(parsedData);

            }
        },
        flush(controller) {
            if (this.buffer) {

                const parsedData = JSON.parse(this.buffer);
                controller.enqueue(parsedData);
            }
        }
    });

    const reader = stream.pipeThrough(jsonStream).getReader();
    await (async function () {
        if(clear)
        clearStore(STYLE_STORE_NAME);

        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }
            

            if(value)
            value.forEach(async element => {
                await storePage(element, STYLE_STORE_NAME);

            });
        }

    })();


}

export const loadGlobalStyles = async (dispatch, clear) => {

    const projectId = localStorage.getItem("project");
    const response = await fetcher('/api/projects/' + projectId, {
        method: 'GET'
    });


    const project = response.project;

    const stream = new ReadableStream({
        start(controller) {
            fetch(`${project.url}/api/theme/style`, {
                headers: { 'x-api-key': project.apikey },

            })
                .then(response => {
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();

                    function processChunk(chunk) {


                        const decodedChunk = decoder.decode(chunk.value, { stream: true });
                        controller.enqueue(decodedChunk);
                        if (chunk.done) {


                            controller.close();
                            return;
                        }
                        reader.read().then(processChunk);
                    }


                    reader.read().then(processChunk);
                })
                .catch(error => {
                    controller.error(error);


                    dispatch({ type: 'error', error: error?.message || 'Something went wrong.' });

                });
        }
    }, { readableStrategy: { highWaterMark: 1 } });


    const jsonStream = new TransformStream({
        start(controller) {
            this.buffer = '';
        },
        transform(chunk, controller) {
            this.buffer += chunk;
            const lines = this.buffer.split('\n');
            this.buffer = lines.pop();

            for (const line of lines) {
                const parsedData = JSON.parse(line);
                controller.enqueue(parsedData);

            }
        },
        flush(controller) {
            if (this.buffer) {

                const parsedData = JSON.parse(this.buffer);
                controller.enqueue(parsedData);
            }
        }
    });

    const reader = stream.pipeThrough(jsonStream).getReader();
    await (async function () {
        if(clear)
        clearStore(STYLE_STORE_NAME);

        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }
            

            if(value)
            value.forEach(async element => {
                await storePage(element, STYLE_STORE_NAME);

            });
        }

    })();


}

export const loadAnimationStyles = async (dispatch, clear) => {

    const projectId = localStorage.getItem("project");
    const response = await fetcher('/api/projects/' + projectId, {
        method: 'GET'
    });


    const project = response.project;

    const stream = new ReadableStream({
        start(controller) {
            fetch(`${project.url}/api/theme/animation`, {
                headers: { 'x-api-key': project.apikey },

            })
                .then(response => {
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();

                    function processChunk(chunk) {


                        const decodedChunk = decoder.decode(chunk.value, { stream: true });
                        controller.enqueue(decodedChunk);
                        if (chunk.done) {


                            controller.close();
                            return;
                        }
                        reader.read().then(processChunk);
                    }


                    reader.read().then(processChunk);
                })
                .catch(error => {
                    controller.error(error);


                    dispatch({ type: 'error', error: error?.message || 'Something went wrong.' });

                });
        }
    }, { readableStrategy: { highWaterMark: 1 } });


    const jsonStream = new TransformStream({
        start(controller) {
            this.buffer = '';
        },
        transform(chunk, controller) {
            this.buffer += chunk;
            const lines = this.buffer.split('\n');
            this.buffer = lines.pop();

            for (const line of lines) {
                const parsedData = JSON.parse(line);
                controller.enqueue(parsedData);

            }
        },
        flush(controller) {
            if (this.buffer) {

                const parsedData = JSON.parse(this.buffer);
                controller.enqueue(parsedData);
            }
        }
    });

    const reader = stream.pipeThrough(jsonStream).getReader();
    await (async function () {
        if(clear)
        clearStore(STYLE_STORE_NAME);

        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }
            

            if(value)
            value.forEach(async element => {
                await storePage(element, STYLE_STORE_NAME);

            });
        }

    })();


}
export const savePage = async (page, type) => {

    const projectId = localStorage.getItem("project");
    const response = await fetcher('/api/projects/' + projectId, {
        method: 'GET'
    });

    const project = response.project;


    return await save(project, page, type);

}

export const save = async (project, page, type) => {



    let data = await getAllData(page._id);


    if (!data) {
        dispatch({ type: 'error', error: 'Something went wrong.' });
        return;
    }

    const elements = data.elements || {};
    const collection = data.collection || {};
    const components = data.components || [];
    const forms = data.forms || [];


    data = await getAllCssData(STYLE_STORE_NAME);

    if (!data) {
        dispatch({ type: 'error', error: 'Something went wrong.' });
        return;
    }

    const styles = data.reduce((acc, cur) => {
        const { elementType, type, mediaIndex, selectors, _uid } = cur;
        if (!acc[type]) {
            acc[type] = {};
        }
        acc[type][elementType] = { elementType, selectors, mediaIndex, _uid };
        return acc;
    }, {});




    return await fetcher(`${project.url}/api/${type}s/${page._id}`, {
        method: 'PATCH',
        headers: { 'x-api-key': project.apikey, 'Content-Type': 'application/json', },
        body: JSON.stringify({ elements, styles: styles, components, collection, forms, creator: project.creator })
    });



}

