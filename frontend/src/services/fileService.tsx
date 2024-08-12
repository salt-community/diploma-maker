export async function getTemplatePdfFile(apiUrl: string, url: string, lastUpdated: Date, setLoadingMessage?: (message: string) => void): Promise<string> {
    const indexedDBKey = `pdf_${url}`;

    const db = await openIndexedDB();

    const cachedPdf = await getFromIndexedDB(db, indexedDBKey);

    if (cachedPdf) {
        const { pdfData, dateAdded } = cachedPdf;
        if (new Date(lastUpdated).toISOString() === dateAdded) {
            return pdfData;
        }
    }

    const pdfResponse = await fetch(`${apiUrl}/api/${url}`);
    if (!pdfResponse.ok) {
        setLoadingMessage?.(`Failed to fetch PDF file from ${url}. The file does not seem to exist.`);
        throw new Error(`Failed to fetch PDF from ${url}`);
    }

    const pdfBlob = await pdfResponse.blob();
    const pdfData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(pdfBlob);
    });

    const dataToStore = {
        id: indexedDBKey,
        pdfData,
        dateAdded: new Date(lastUpdated).toISOString(),
    };

    await storeInIndexedDB(db, indexedDBKey, dataToStore);

    return pdfData;
}

async function openIndexedDB(): Promise<IDBDatabase> {
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

async function getFromIndexedDB(db: IDBDatabase, key: string): Promise<any> {
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

async function storeInIndexedDB(db: IDBDatabase, key: string, data: any): Promise<void> {
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