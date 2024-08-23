import { PDFDocument } from "pdf-lib";
import { Size } from "./types";

export const getPdfDimensions = async (pdfString: string): Promise<Size> => {
    const pdfDoc = await PDFDocument.load(pdfString);
    const firstPage = pdfDoc.getPage(0);
    const { width, height } = firstPage.getSize();
    return { width, height };
};