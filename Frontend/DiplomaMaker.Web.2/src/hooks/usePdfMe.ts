import { useEffect, useRef } from "react";

import { FileService, PdfMe, PdfMeTypes, TemplateService } from "../services";
import { TemplateSubstitutions } from "../types/types";

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
        if (designerContainerRef && !designer.current) {
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

        const substitutedInputs = TemplateService.substitutePlaceholders(template, inputs);

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

        const template = await TemplateService.getTemplateFromJsonFile(event.target.files[0]);
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

    async function onSaveTemplateToBackend() {
        if (!designer.current)
            throw new Error("Designer is not initialized");

        const template = designer.current.getTemplate();
        
        const result = await fetch("http://localhost:5171/api/Template/SaveTemplate", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                content: JSON.stringify(template)
            })
        });
    }

    function onResetTemplate() {
        if (!designer.current)
            throw new Error("Designer is not initialized");

        designer.current.updateTemplate(initialTemplate ?? defaultTemplate);
    };

    return {
        generatePdf,
        handleLoadTemplate,
        onChangeBasePdf,
        onDownloadTemplate,
        onResetTemplate
    }
}