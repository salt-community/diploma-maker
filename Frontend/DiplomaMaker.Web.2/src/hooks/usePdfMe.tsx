import { useEffect, useRef } from "react";

import { FileService, PdfMe, PdfMeTypes } from "../services";
import { TemplateSubstitutions } from "../types/types";
import { substitutePlaceholders } from "../services/templatesService";

export function usePdfMe(
    designerContainerRef?: React.MutableRefObject<HTMLDivElement | null>,
    initialTemplate?: PdfMeTypes.Template
) {
    const designer = useRef<PdfMeTypes.Designer | null>(null);

    const defaultTemplate: PdfMeTypes.Template = { basePdf: PdfMe.BLANK_PDF, schemas: [[]] };

    const plugins = {
        Text: PdfMe.text,
        QR: PdfMe.barcodes.qrcode,
        Image: PdfMe.image,
    };

    useEffect(() => {
        if (designerContainerRef) {
            const domContainer = designerContainerRef.current;

            if (domContainer)
                designer.current = new PdfMeTypes.Designer({
                    domContainer, template: initialTemplate ?? defaultTemplate, plugins
                });
        }
    });

    async function generatePdf(inputs: TemplateSubstitutions) {
        if (!designer.current)
            throw new Error("Designer is not initialized");

        const template = designer.current.getTemplate();

        console.log(template);
        const substitutedInputs = substitutePlaceholders(template, inputs);
        console.log(substitutedInputs);

        const pdf = await PdfMe.generate({
            template,
            plugins,
            inputs: substitutedInputs
        });

        const blob = new Blob([pdf.buffer], { type: "application/pdf" });

        //temporary, should not work like this by default later
        window.open(URL.createObjectURL(blob));

        return blob;
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
    const template: PdfMeTypes.Template = JSON.parse(await FileService.readTextFile(file));
    PdfMe.checkTemplate(template);
    return template;
};