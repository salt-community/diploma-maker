const apiUrl = import.meta.env.VITE_API_URL;

export async function getTemplatePdfFile(url: string, lastUpdated?: Date): Promise<string> {
    const localStorageKey = `pdf_${url}`;
    const cachedPdf = localStorage.getItem(localStorageKey);

    if (cachedPdf) {
        const { pdfData } = JSON.parse(cachedPdf);
        return pdfData;
    }

    const pdfResponse = await fetch(`${apiUrl}/api/${url}`);
    if (!pdfResponse.ok) {
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
        dateAdded: new Date().toISOString()
    };

    localStorage.setItem(localStorageKey, JSON.stringify(dataToStore));
    return pdfData;
}