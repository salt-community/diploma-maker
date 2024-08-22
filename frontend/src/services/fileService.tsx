import { getFromIndexedTemplatesDB, openIndexedTemplatesDB, storeInIndexedTemplatesDB } from "../util/helper";
import { apiEndpointParameters } from "../util/types";

export async function getTemplatePdfFile(apiParameters: apiEndpointParameters, url: string, lastUpdated: Date, setLoadingMessage?: (message: string) => void): Promise<string> {
    const indexedDBKey = `pdf_${url}`;

    const db = await openIndexedTemplatesDB();

    const cachedPdf = await getFromIndexedTemplatesDB(db, indexedDBKey);

    if (cachedPdf) {
        const { pdfData, dateAdded } = cachedPdf;
        if (new Date(lastUpdated).toISOString() === dateAdded) {
            return pdfData;
        }
    }

    const pdfResponse = await fetch(`${apiParameters.endpointUrl}/api/${url}`, {
        headers: {'Authorization': `Bearer ${apiParameters.token}` }
    });
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

    await storeInIndexedTemplatesDB(db, indexedDBKey, dataToStore);

    return pdfData;
}