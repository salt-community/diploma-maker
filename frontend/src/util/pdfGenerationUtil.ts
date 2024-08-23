import { Template } from "@pdfme/common";
import { pdfGenerationResponse } from "./types";
import { getFontsData } from "./fontsUtil";
import { PDFDocument } from "pdf-lib";
import { generate } from "@pdfme/generator";
import { getPlugins } from "./helper";
import JSZip from "jszip";

export const generatePDF = async (template: Template, inputs: any, returnFile?: boolean): Promise<Blob | void> => {
    if(!template) return;
    const font = await getFontsData();

    const pdf = await generate({
        template,
        inputs,
        options: { font },
        plugins: getPlugins(),
    });

    const blob = new Blob([pdf.buffer], { type: "application/pdf" });
    if(returnFile){
        return blob;
    }
    else{
        window.open(URL.createObjectURL(blob));
    }
};

export const newGenerateCombinedPDF = async (templates: Template[], inputsArray: any[], setLoadingMessage: (message: string) => void): Promise<pdfGenerationResponse> => {
    setLoadingMessage("Generating combined pdf!");

    const font = await getFontsData();
    const mergedPdf = await PDFDocument.create();; 

    const pdfs: Uint8Array[] = [];

    for (let i = 0; i < templates.length; i++) {
        setLoadingMessage(`Generating pdf for file: ${i + 1}/${templates.length}`);
        const pdf = await generate({
        template: templates[i],
        inputs: [inputsArray[i]],
        options: { font },
        plugins: getPlugins(),
        });

        pdfs.push(pdf);

        const loadedPdf = await PDFDocument.load(pdf);
        const copiedPages = await mergedPdf.copyPages(loadedPdf, loadedPdf.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
    }

    setLoadingMessage("Merging Pdfs");

    const mergedPdfBytes = await mergedPdf.save();
    setLoadingMessage("Creating Blobs");
    const blob: Blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
    setLoadingMessage("Finished Processing Pdfs...");

    const response: pdfGenerationResponse = {
        pdfFiles: pdfs,
        bundledPdfsDisplayObject: blob
    }

    return response;
}
  
  
export const newGenerateAndPrintCombinedPDF = async (templates: Template[], inputsArray: any[], setLoadingMessage: (message: string) => void): Promise<pdfGenerationResponse> => {
    setLoadingMessage("Generating combined pdf!");
    const font = await getFontsData();
    const mergedPdf = await PDFDocument.create();

    const pdfs: Uint8Array[] = [];

    for (let i = 0; i < templates.length; i++) {
        setLoadingMessage(`Generating pdf for file: ${i + 1}/${templates.length}`);
        const pdf = await generate({
        template: templates[i],
        inputs: [inputsArray[i]],
        options: { font },
        plugins: getPlugins(),
        });
        pdfs.push(pdf);

        const loadedPdf = await PDFDocument.load(pdf);
        const copiedPages = await mergedPdf.copyPages(loadedPdf, loadedPdf.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
    }

    setLoadingMessage("Merging Pdfs");

    const mergedPdfBytes = await mergedPdf.save();
    setLoadingMessage("Creating Blobs");
    const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
    setLoadingMessage("Finished Processing Pdfs...");

    const response: pdfGenerationResponse = {
        pdfFiles: pdfs,
        bundledPdfsDisplayObject: blob
    }

    return response;
};
  
export const newGenerateAndDownloadZippedPDFs = async (templates: Template[], inputsArray: any[], bootcampName: string, setLoadingMessage: (message: string) => void): Promise<pdfGenerationResponse> => {
    setLoadingMessage("Generating combined pdf!");
    const font = await getFontsData();
    const zip = new JSZip();

    const pdfs: Uint8Array[] = [];

    for (let i = 0; i < templates.length; i++) {
        setLoadingMessage(`Generating pdf for file: ${i + 1}/${templates.length}`);
        const pdf = await generate({
        template: templates[i],
        inputs: [inputsArray[i]],
        options: { font },
        plugins: getPlugins(),
        });
        pdfs.push(pdf);

        const loadedPdf = await PDFDocument.load(pdf);
        const mergedPdf = await PDFDocument.create();
        const copiedPages = await mergedPdf.copyPages(loadedPdf, loadedPdf.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
        
        const pdfBytes = await mergedPdf.save();
        zip.file(`Diploma ${inputsArray[i].main}.pdf`, pdfBytes);
    }

    setLoadingMessage("Zipping Pdfs");

    const zipBlob = await zip.generateAsync({ type: "blob" });

    setLoadingMessage("Finished Processing Pdfs...");

    const response: pdfGenerationResponse = {
        pdfFiles: pdfs,
        bundledPdfsDisplayObject: zipBlob
    }

    return response;
};


export const generatePDFDownload = async (template: Template, inputs: any, fileName: string): Promise<void> => {
    if (!template) return;

    const font = await getFontsData();
  
    const pdf = await generate({
      template,
      inputs,
      options: { font },
      plugins: getPlugins(),
    });
  
    const blob = new Blob([pdf.buffer], { type: "application/pdf" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};