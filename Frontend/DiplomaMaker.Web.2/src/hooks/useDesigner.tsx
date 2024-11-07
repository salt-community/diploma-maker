import { BLANK_PDF, checkTemplate, Template } from "@pdfme/common";
import { Designer } from "@pdfme/ui";
import { text, barcodes, image } from "@pdfme/schemas"
import { useEffect, useRef } from "react";
import { downloadJsonFile, readDataUrlFile, readTextFile } from "../services/fileService";
import { generate } from "@pdfme/generator";

export function useDesigner(
    containerRef?: React.MutableRefObject<HTMLDivElement | null>,
    template?: Template
) {
    const designer = useRef<Designer | null>(null);

    const defaultTemplate: Template = { basePdf: BLANK_PDF, schemas: [[]] };

    const plugins = {
        Text: text,
        QR: barcodes.qrcode,
        Image: image,
    };

    useEffect(() => {
        if (containerRef) {
            const domContainer = containerRef.current;

            if (domContainer)
                designer.current = new Designer({
                    domContainer, template: template ?? defaultTemplate, plugins
                });
        }
    });

    async function generatePdf(inputs: Record<string, unknown>[]) {
        if (!designer.current)
            throw new Error("Designer is not initialized");

        const template = designer.current.getTemplate();

        const pdf = await generate({
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

        const basePdf = await readDataUrlFile(event.target.files[0])
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

        downloadJsonFile(designer.current.getTemplate(), "template");
    };

    function onResetTemplate() {
        if (!designer.current)
            throw new Error("Designer is not initialized");

        designer.current.updateTemplate(template ?? defaultTemplate);
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
    const template: Template = JSON.parse(await readTextFile(file));
    checkTemplate(template);
    return template;
};