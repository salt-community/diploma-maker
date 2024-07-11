const apiUrl = import.meta.env.VITE_API_URL;

export async function getTemplatePdfFile(url: string): Promise<string> {
    const localStorageURL = `${url}`;
    console.log("LOCALSTORAGEURL");
    console.log(localStorageURL);
    const cachedPdf = localStorage.getItem(localStorageURL);

    if (cachedPdf) {
        return cachedPdf;
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

    localStorage.setItem(localStorageURL, pdfData);
    return pdfData;
}