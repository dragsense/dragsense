export const DB_NMAE = 'ac_editor';
export const PAGE_STORE_NAME = 'pages_store';
export const UNDO_STORE_NAME = 'undo_store';
export const REDO_STORE_NAME = 'redo_store';
export const STYLE_STORE_NAME = 'styles_store';
import { nanoid } from 'nanoid';



export const openDB = async () => {
    return await new Promise((resolve, reject) => {


        let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
        const request = indexedDB.open(DB_NMAE);

        request.onupgradeneeded = () => {
            const db = request.result;
            const store1 = db.createObjectStore(PAGE_STORE_NAME, { keyPath: '_id' });
            store1.createIndex('id', '_id');
            //store1.createIndex('tagAndName', ['tagName', 'name']);

            const store2 = db.createObjectStore(STYLE_STORE_NAME, { keyPath: '_uid' });
            store2.createIndex('type', ['type', 'elementType'], { unique: false });

            db.createObjectStore(UNDO_STORE_NAME, { autoIncrement: true });
            db.createObjectStore(REDO_STORE_NAME, { autoIncrement: true });
        };

        request.onsuccess = () => {
            const db = request.result;
            resolve(db);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
};

export const storePage = async (element, STORE = PAGE_STORE_NAME) => {
    const db = await openDB();
    const transaction = db.transaction([STORE], 'readwrite');
    const store = transaction.objectStore(STORE);

    await store.put(element);


    await transaction.complete;
};


export const storeData = async (key, newElements, STORE = PAGE_STORE_NAME) => {

    return await new Promise(async (resolve, reject) => {

        const db = await openDB();
        const transaction = db.transaction([STORE], 'readwrite');
        const store = transaction.objectStore(STORE);

        const cursorIndex = store.index("id");

        const range = IDBKeyRange.only(key);

        const request = cursorIndex.openCursor(range);



        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {

                const elements = cursor.value.elements || {};

                const updatedElements = newElements.reduce((result, obj) => {
                    return Object.assign(result, obj);
                }, elements);

                const updateData = { ...cursor.value, elements: updatedElements };

                const updateRequest = cursor.update(updateData);


                updateRequest.onsuccess = () => {
                    resolve(true);
                };

                updateRequest.onerror = () => {
                    reject(updateRequest.error);
                };

            }
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
};


export const deletePageData = async (key, STORE = PAGE_STORE_NAME) => {

    return await new Promise(async (resolve, reject) => {

        const db = await openDB();
        const transaction = db.transaction([STORE], 'readwrite');
        const store = transaction.objectStore(STORE);

        const cursorIndex = store.index("id");

        const range = IDBKeyRange.only(key);


        const request = cursorIndex.openCursor(range);

        request.onsuccess = (event) => {

            const cursor = event.target.result;
            if (cursor)
                cursor.delete();
            resolve(true);

        };

        request.onerror = () => {
            reject(request.error);
        };
    });
};

export const clearStore = async (STORE = PAGE_STORE_NAME) => {
    const db = await openDB();
    const transaction = db.transaction([STORE], 'readwrite');
    const store = transaction.objectStore(STORE);

    await store.clear();


    await transaction.complete;
};


export const getAllData = async (key, STORE = PAGE_STORE_NAME) => {

    if (!key)
        return;

    return await new Promise(async (resolve, reject) => {

        const db = await openDB();
        const store = db.transaction(STORE).objectStore(STORE);

        const request = store.index("id").get(key);

        request.onsuccess = async function (event) {
            const data = event.target.result;
            if (data)
                resolve(data);
            else
                resolve(null);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
};


export const getAllKeys = async (STORE = PAGE_STORE_NAME) => {

    return await new Promise(async (resolve, reject) => {
        const db = await openDB();
        const transaction = db.transaction([STORE], 'readonly');
        const store = transaction.objectStore(STORE);
        const index = store.index('type');
        const getRequest = index.openCursor(null, 'nextunique');
        const values = [];

        getRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const [, elementType] = cursor.key;
                values.push(elementType);
                cursor.continue();
            } else {
                resolve(values);
            }
        };

        getRequest.onerror = () => {
            reject(getRequest.error);
        };
    });
};

export const getAllCssData = async (STORE = PAGE_STORE_NAME) => {

    return await new Promise(async (resolve, reject) => {
        const db = await openDB();
        const transaction = db.transaction([STORE], 'readonly');
        const store = transaction.objectStore(STORE);

        const request = store.getAll();

        request.onsuccess = (event) => {
            const record = event.target.result;
            if (record) {

                resolve(record);
            } else
                resolve([]);
        }

        request.onerror = () => {
            reject(request.error);
        };
    });
};

export const getData = async (key, _uid, index = 'id', STORE = PAGE_STORE_NAME) => {

    if (!key)
        return;

    return await new Promise(async (resolve, reject) => {

        const db = await openDB();
        const store = db.transaction(STORE).objectStore(STORE);
        const request = store.index(index).get(key);

        request.onsuccess = async function (event) {
            const data = event.target.result;
            if (data && data.elements[_uid])
                resolve(data.elements[_uid]);
            else
                resolve(null);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

export const searchData = async (searchText, limit = 25, STORE = PAGE_STORE_NAME) => {
    return await new Promise(async (resolve, reject) => {
        const db = await openDB();
        const store = db.transaction(STORE).objectStore(STORE);


        const index = store.index('id');

        const lowerBound = searchText.toLowerCase();
        const upperBound = lowerBound + '\uffff';
        const range = IDBKeyRange.bound(lowerBound, upperBound);

        const request = index.openCursor(range);

        let results = [];
        let count = 0;
        let lastResult = null;

        const handleResult = event => {
            const cursor = event.target.result;
            if (cursor) {
                const record = cursor.value;
                const title = record.name || record.tagName;
                if (title.indexOf(searchText) > -1) {
                    results.push(record);
                    count++;
                    if (count < limit) {
                        lastResult = cursor.key;
                        cursor.continue();
                    }
                } else {
                    cursor.continue();
                }
            } else {
                resolve({ results, lastResult });
            }
        };

        const handleError = event => {
            reject(event.target.error);
        };


        // store.openCursor().onsuccess = function (event) {
        //     const cursor = event.target.result;
        //     if (cursor) {
        //         const record = cursor.value;
        //         const title = record.name || record.tagName;
        //         if (title.indexOf(searchText) > -1) {
        //             results.push(record);
        //         }
        //         cursor.continue();
        //     } else {
        //         resolve(results);
        //     }
        // };

        request.addEventListener('success', handleResult);
        request.addEventListener('error', handleError);
    });
}


export const searchSelector = async (key) => {
    return await new Promise(async (resolve, reject) => {
        const db = await openDB();
        const store = db.transaction(STYLE_STORE_NAME).objectStore(STYLE_STORE_NAME);


        const index = store.index('type');
        const request = index.get(key);

        request.onsuccess = async function (event) {
            const data = event.target.result;
            resolve(data);
        };

        request.onerror = () => {
            reject(request.error);
        };

    });
}

export const updateData = async (key, element, STORE = PAGE_STORE_NAME) => {

    return await new Promise(async (resolve, reject) => {


        const db = await openDB();
        const transaction = db.transaction([STORE], 'readwrite');
        const store = transaction.objectStore(STORE);
        const cursorIndex = store.index("id");

        const range = IDBKeyRange.only(key);

        const request = cursorIndex.openCursor(range);



        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const elements = cursor.value.elements || {};
                elements[element._uid] = element;

                const updateRequest = cursor.update({ ...cursor.value, elements });
                updateRequest.onsuccess = () => {
                    resolve(true);
                };

                updateRequest.onerror = () => {
                    reject(updateRequest.error);
                };

            }
        };

        request.onerror = () => {
            reject(request.error);
        };
    });


};

export const updateStyleData = async (selector, key, deleted = false) => {

    return await new Promise(async (resolve, reject) => {

        const db = await openDB();

        const transaction = db.transaction([STYLE_STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STYLE_STORE_NAME);
        const cursorIndex = objectStore.index("type");

        const range = IDBKeyRange.only(key);

        const request = cursorIndex.openCursor(range);


        request.onsuccess = (event) => {

            const cursor = event.target.result;
            if (cursor) {
                const selectors = cursor.value.selectors || {};
                if (deleted) {
                    delete selectors[selector.selectorText];
                    if (Object.keys(selectors).length === 0) {
                        cursor.delete();
                        resolve(true);

                    } else {
                        const updateRequest = cursor.update({ ...cursor.value, mediaIndex: selector.mediaIndex });
                        updateRequest.onsuccess = () => {
                            resolve(true);
                        };
                        updateRequest.onerror = () => {
                            reject(updateRequest.error);
                        };
                    }
                } else {
                    selectors[selector.selectorText] = {
                        index: selector.index,
                        selectorText: selector.selectorText,
                        properties: selector.properties,
                        className: selector.className,

                    };
                    const updateRequest = cursor.update({ ...cursor.value, mediaIndex: selector.mediaIndex });
                    updateRequest.onsuccess = () => {
                        resolve(true);
                    };
                    updateRequest.onerror = () => {
                        reject(updateRequest.error);
                    };
                }

            } else if (!deleted) {
                // Add new data if not found
                const _uid = nanoid(8);

                const addRequest = objectStore.add({
                    selectors:
                    {
                        [selector.selectorText]: {
                            selectorText: selector.selectorText,
                            index: selector.index,
                            properties: selector.properties,
                            className: selector.className,

                        }
                    },
                    type: selector.type,
                    mediaIndex: selector.mediaIndex,
                    elementType: selector.elementType,
                    _uid
                });

                addRequest.onsuccess = () => {


                    resolve(true);
                };

                addRequest.onerror = () => {
                    reject(addRequest.error);
                };
            }
        };


        request.onerror = () => {
            reject(request.error);
        };

    });
};

export const deleteStyleData = async (key) => {

    return await new Promise(async (resolve, reject) => {

        const db = await openDB();

        const transaction = db.transaction([STYLE_STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STYLE_STORE_NAME);
        const cursorIndex = objectStore.index("type");

        const range = IDBKeyRange.only(key);

        const request = cursorIndex.openCursor(range);

        request.onsuccess = (event) => {

            const cursor = event.target.result;
            if (cursor) {
                const _uid = nanoid(8);

                const result = { ...cursor.value, _uid }
                cursor.delete();
                resolve(result);

            } else
                resolve({});

        };

        request.onerror = () => {
            reject(request.error);
        };

    });
};



export const deleteData = async (key, _uid, STORE = PAGE_STORE_NAME) => {

    return await new Promise(async (resolve, reject) => {

        const db = await openDB();

        const transaction = db.transaction([STORE], 'readwrite');
        const objectStore = transaction.objectStore(STORE);
        const cursorIndex = objectStore.index("id");

        const range = IDBKeyRange.only(key);

        const request = cursorIndex.openCursor(range);



        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const elements = cursor.value.elements || {};
                if (elements[_uid]) {
                    delete elements[_uid];
                    const updateRequest = cursor.update({ ...cursor.value, elements });

                    updateRequest.onsuccess = () => {
                        resolve(true);
                    };

                    updateRequest.onerror = () => {
                        reject(updateRequest.error);
                    };
                }
            }
        };


        request.onerror = () => {
            reject(request.error);
        };

    });
};
export const storeAction = async (action, STORE) => {
    const db = await openDB();
    const transaction = db.transaction([STORE], 'readwrite');
    const store = transaction.objectStore(STORE);

    store.add(action);
    await transaction.complete;
};

export const storeActions = async (actions, STORE) => {
    const db = await openDB();
    const transaction = db.transaction(STORE, 'readwrite');
    const store = transaction.objectStore(STORE);

    actions.forEach((action) => {
        store.add(action);
    });

    await transaction.complete;
};

export const getAction = async (STORE) => {

    return new Promise(async (resolve, reject) => {

        const db = await openDB();
        const transaction = db.transaction(STORE, 'readonly');
        const store = transaction.objectStore(STORE);

        const mainRequest = store.getAllKeys();

        mainRequest.onsuccess = (event) => {
            const items = event.target.result;

            if (items.length <= 0) {
                resolve(null);
                return;
            }

            const lastKey = items[items.length - 1];

            const request = store.get(lastKey);

            request.onsuccess = (event) => {
                const item = event.target.result;
                resolve(item);
            };

            request.onerror = () => {
                reject(request.error);
            };

        };

        mainRequest.onerror = () => {
            reject(request.error);
        };


    });
};

export const deleteAction = async (STORE) => {


    return new Promise(async (resolve, reject) => {

        const db = await openDB();
        const transaction = db.transaction(STORE, 'readwrite');
        const store = transaction.objectStore(STORE);

        const mainRequest = store.getAllKeys();

        mainRequest.onsuccess = (event) => {
            const items = event.target.result;
            const lastKey = items[items.length - 1];

            const request = store.delete(lastKey);
            request.onsuccess = (event) => {
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };

        };

        mainRequest.onerror = () => {
            reject(request.error);
        };


    });

};

export const getAllActions = async (STORE) => {
    return new Promise(async (resolve, reject) => {
        const db = await openDB();
        const transaction = db.transaction(STORE, 'readonly');
        const store = transaction.objectStore(STORE);

        const request = store.getAll();

        request.onsuccess = (event) => {
            const items = event.target.result;
            resolve(items);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
};

export const deleteAllActions = async (STORE) => {
    return new Promise(async (resolve, reject) => {
        const db = await openDB();
        const transaction = db.transaction(STORE, 'readwrite');
        const store = transaction.objectStore(STORE);

        const request = store.clear();

        request.onsuccess = (event) => {
            resolve();
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
};