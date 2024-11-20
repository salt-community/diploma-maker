/*
    usePdfMe

    A hook that serves as a layer between PdfMe and any component
    that wishes to use its functionality.
*/

import { useEffect, useRef } from "react";

import {
  FileService,
  FontService,
  PdfMe,
  PdfMeTypes,
  TemplateService,
} from "../services";
import { Template } from "../api/models";
import { Endpoints } from "../api";
import useEntity from "./useEntity";
import { useTemplates } from "./useTemplates";

export function usePdfMe(
  designerContainerRef?: React.MutableRefObject<HTMLDivElement | null>,
  initialTemplate?: PdfMeTypes.Template,
) {
  const templatesHook = useTemplates();
  const designer = useRef<PdfMeTypes.Designer | null>(null);

  const defaultTemplate: PdfMeTypes.Template = {
    basePdf: PdfMe.BLANK_PDF,
    schemas: [[]],
  };

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
          domContainer,
          template: initialTemplate ?? defaultTemplate,
          options: {
            font: FontService.getPdfMeFonts(),
          },
          plugins,
        });
    }
  });

  async function generatePdf(inputs: Record<string, string>) {
    if (!designer.current) throw new Error("Designer is not initialized");

    const template = designer.current.getTemplate();

    const substitutedInputs = TemplateService.substitutePlaceholdersWithContent(
      template,
      inputs,
    );

    const pdf = await PdfMe.generate({
      template,
      plugins,
      inputs: substitutedInputs,
    });

    const blob = new Blob([pdf.buffer], { type: "application/pdf" });

    //temporary, should not work like this by default later
    window.open(URL.createObjectURL(blob));

    return blob;
  }

  async function handleLoadTemplate(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    if (!designer.current) throw new Error("Designer is not initialized");

    if (!event.target?.files) throw new Error("Files are not defined");

    const template = await TemplateService.getTemplateFromJsonFile(
      event.target.files[0],
    );

    designer.current.updateTemplate(template);
  }

  async function onChangeBasePdf(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target?.files) throw new Error("Files are not defined");

    if (!designer.current) throw new Error("Designer is not initialized");

    const basePdf = await FileService.readDataUrlFile(event.target.files[0]);
    const currentTemplate = designer.current.getTemplate();

    designer.current.updateTemplate(
      Object.assign(JSON.parse(JSON.stringify(currentTemplate)), {
        basePdf,
      }),
    );
  }

  //TODO: remove as templates should only be saved in backend
  function onDownloadTemplate() {
    if (!designer.current) throw new Error("Designer is not initialized");

    FileService.downloadJsonFile(designer.current.getTemplate(), "template");
  }

  async function onSaveTemplate() {
    if (!designer.current) throw new Error("Designer is not initialized");

    const template = designer.current.getTemplate();

    templatesHook.postTemplate({
      name: "Unnamed template",
      templateJson: JSON.stringify(template),
    });
  }

  async function onLoadTemplate(template: Template) {
    if (!designer.current) throw new Error("Designer is not initialized");

    if (!template) {
      console.log("Template dosen't exist!");
      return;
    }

    const pdfMeTemplate: PdfMeTypes.Template = JSON.parse(
      template.templateJson,
    );

    PdfMe.checkTemplate(pdfMeTemplate);

    designer.current.updateTemplate(pdfMeTemplate);
  }

  function onResetTemplate() {
    if (!designer.current) throw new Error("Designer is not initialized");

    designer.current.updateTemplate(initialTemplate ?? defaultTemplate);
  }

  function handleReloadFonts() {
    if (!designer.current) throw new Error("Designer is not initialized");

    designer.current.updateOptions({ font: FontService.getPdfMeFonts() });
  }

  return {
    generatePdf,
    handleLoadTemplate,
    onChangeBasePdf,
    onDownloadTemplate,
    onResetTemplate,
    handleReloadFonts,
    onSaveTemplate,
    onLoadTemplate,
  };
}
