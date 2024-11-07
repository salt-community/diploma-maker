import { Template } from "@pdfme/common";
import { Designer } from "@pdfme/ui";

import { useEffect, useRef } from "react";

import { FileService, PdfMe } from "../services";

export function usePdfMe(
    designerContainerRef?: React.MutableRefObject<HTMLDivElement | null>,
    initialTemplate?: Template
) {
    const designer = useRef<Designer | null>(null);

    const defaultTemplate: Template = { basePdf: PdfMe.BLANK_PDF, schemas: [[]] };

    const plugins = {
        Text: PdfMe.text,
        QR: PdfMe.barcodes.qrcode,
        Image: PdfMe.image,
    };

    useEffect(() => {
        if (designerContainerRef) {
            const domContainer = designerContainerRef.current;

            if (domContainer)
                designer.current = new Designer({
                    domContainer, template: initialTemplate ?? defaultTemplate, plugins
                });
        }
    });

    async function generatePdf(inputs: Record<string, unknown>[]) {
        if (!designer.current)
            throw new Error("Designer is not initialized");

        const template = designer.current.getTemplate();

        const pdf = await PdfMe.generate({
            template,
            plugins,
            inputs
        });

        const blob = new Blob([pdf.buffer], { type: "application/pdf" });
        window.open(URL.createObjectURL(blob));
    };

    async function handleLoadTemplate(event: React.ChangeEvent<HTMLInputElement>) {
        if (!designer.current)
            throw new Error("Designer is not initialized");

        if (!event.target?.files)
            throw new Error("Files are not defined");

        const template = await getTemplateFromJsonFile(event.target.files[0]);
        designer.current.updateTemplate(template);
    }

    async function onChangeBasePdf(event: React.ChangeEvent<HTMLInputElement>) {
        if (!event.target?.files)
            throw new Error("Files are not defined");

        if (!designer.current)
            throw new Error("Designer is not initialized");

        const basePdf = await FileService.readDataUrlFile(event.target.files[0])
        const currentTemplate = designer.current.getTemplate();

        designer.current.updateTemplate(
            Object.assign(JSON.parse(JSON.stringify(currentTemplate)), {
                basePdf
            })
        );
    };

    function onDownloadTemplate() {
        if (!designer.current)
            throw new Error("Designer is not initialized");

        FileService.downloadJsonFile(designer.current.getTemplate(), "template");
    };

    function onResetTemplate() {
        if (!designer.current)
            throw new Error("Designer is not initialized");

        designer.current.updateTemplate(initialTemplate ?? defaultTemplate);
    };

    return {
        designer: designer.current,
        generatePdf,
        handleLoadTemplate,
        onChangeBasePdf,
        onDownloadTemplate,
        onResetTemplate
    }
}

async function getTemplateFromJsonFile(file: File) {
    const template: Template = JSON.parse(await FileService.readTextFile(file));
    PdfMe.checkTemplate(template);
    return template;
};