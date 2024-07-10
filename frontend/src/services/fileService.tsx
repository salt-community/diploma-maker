const apiUrl = import.meta.env.VITE_API_URL;

export async function getTemplatePdfFile(url: string): Promise<string> {
    const pdfResponse = await fetch(`${apiUrl}/api/${url}`);
    if (!pdfResponse.ok) {
        throw new Error(`Failed to fetch PDF from ${url}`);
    }

    const pdfBlob = await pdfResponse.blob();
    return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(pdfBlob);
    });
}