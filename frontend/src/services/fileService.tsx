export async function getTemplatePdfFile(apiUrl: string, url: string, lastUpdated: Date, setLoadingMessage?: (message: string) => void): Promise<string> {
    const localStorageKey = `pdf_${url}`;
    const cachedPdf = localStorage.getItem(localStorageKey);

    if (cachedPdf) {
        const { pdfData, dateAdded } = JSON.parse(cachedPdf);
        if (new Date(lastUpdated).toISOString() === dateAdded) {
            return pdfData;
        }
    }

    const pdfResponse = await fetch(`${apiUrl}/api/${url}`);
    if (!pdfResponse.ok) {
        setLoadingMessage(`Failed to fetch PDF file from ${url}. The file does not seem to exist.`)
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
        pdfData,
        dateAdded: new Date(lastUpdated).toISOString()
    };

    try {
        localStorage.setItem(localStorageKey, JSON.stringify(dataToStore));
    } catch (e) {
        if (e instanceof DOMException && e.name === 'QuotaExceededError') {
            const keys = Object.keys(localStorage);

            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (key.startsWith('pdf_')) {
                    localStorage.removeItem(key);
                    break;
                }
            }
            localStorage.setItem(localStorageKey, JSON.stringify(dataToStore));
        } else {
            throw e;
        }
    }

    return pdfData;
}