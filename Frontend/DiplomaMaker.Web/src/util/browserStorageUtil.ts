export const openFontsIndexedDB = () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('fontDatabase', 1);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore('fonts');
        };

        request.onsuccess = (event: Event) => {
        resolve((event.target as IDBOpenDBRequest).result);
        };

        request.onerror = (event: Event) => {
        reject((event.target as IDBOpenDBRequest).error);
        };
    });
};
  
export const storeFontInIndexedDB = async (label: string, fontData: ArrayBuffer) => {
    const db = await openFontsIndexedDB();
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(['fonts'], 'readwrite');
        const store = transaction.objectStore('fonts');
        const request = store.put(fontData, label);

        request.onsuccess = () => {
        resolve();
        };

        request.onerror = (event: Event) => {
        reject((event.target as IDBRequest).error);
        };
    });
};
  
export const getFontFromIndexedDB = async (label: string): Promise<ArrayBuffer | null> => {
    const db = await openFontsIndexedDB();
    return new Promise<ArrayBuffer | null>((resolve, reject) => {
        const transaction = db.transaction(['fonts'], 'readonly');
        const store = transaction.objectStore('fonts');
        const request = store.get(label);

        request.onsuccess = (event: Event) => {
        resolve((event.target as IDBRequest).result as ArrayBuffer | null);
        };

        request.onerror = (event: Event) => {
        reject((event.target as IDBRequest).error);
        };
    });
};


export async function openIndexedTemplatesDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('pdfCache', 1);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains('pdfs')) {
                db.createObjectStore('pdfs', { keyPath: 'id' });
            }
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}
  
export async function getFromIndexedTemplatesDB(db: IDBDatabase, key: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('pdfs', 'readonly');
        const store = transaction.objectStore('pdfs');
        const request = store.get(key);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}
  
export async function storeInIndexedTemplatesDB(db: IDBDatabase, key: string, data: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
        const transaction = db.transaction('pdfs', 'readwrite');
        const store = transaction.objectStore('pdfs');

        const countRequest = store.count();
        countRequest.onsuccess = async () => {
            const count = countRequest.result;

            if (count >= 25) {
                const cursorRequest = store.openCursor();
                cursorRequest.onsuccess = (event) => {
                    const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
                    if (cursor) {
                        store.delete(cursor.primaryKey);
                        cursor.continue();
                    }
                };
            }

            const putRequest = store.put(data);
            putRequest.onsuccess = () => {
                resolve();
            };
            putRequest.onerror = () => {
                reject(putRequest.error);
            };
        };

        countRequest.onerror = () => {
            reject(countRequest.error);
        };
    });
}