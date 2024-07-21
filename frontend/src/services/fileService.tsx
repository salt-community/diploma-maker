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
        dateAdded: new Date(lastUpdated).toISOString()  // Store the last updated date as ISO string
    };

    localStorage.setItem(localStorageKey, JSON.stringify(dataToStore));
    return pdfData;
}