import * as pdfjsLib from 'pdfjs-dist';

export function convertUint8ArrayToBase64(uint8Array: Uint8Array): string {
    let binaryString = '';
    for (let i = 0; i < uint8Array.length; i++) {
        binaryString += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binaryString);
}

// No Longer Used In front-end cause it slows down application. But it is faster than doing it in the backend
export const convertPDFToImage = async (pdfInput: ArrayBuffer): Promise<Blob | null> => {
    try {
        const pdf = await pdfjsLib.getDocument({ data: pdfInput }).promise;
        
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
        canvasContext: canvas.getContext("2d"),
        viewport: viewport,
        };
        
        await page.render(renderContext).promise;
        const dataURL = canvas.toDataURL("image/png");
        
        const base64Data = dataURL.replace(/^data:image\/png;base64,/, '');
        const binaryString = window.atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        
        for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
        }
        
        return new Blob([bytes], { type: 'image/png' });
    } catch (e) {
        console.error('Error loading PDF:', e);
        return null;
    }
};