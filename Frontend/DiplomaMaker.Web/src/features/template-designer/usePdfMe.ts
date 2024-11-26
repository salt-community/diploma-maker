/*
    usePdfMe

    A hook that serves as a layer between PdfMe and any component
    that wishes to use its functionality.
*/

import { useEffect, useRef } from "react";

import {
  FileService,
  FontService,
  PdfMeService,
  TemplateService,
} from "@/services";

import type { BackendTypes, PdfMeTypes, TemplateTypes } from "@/services";
import { useTemplates } from "@/hooks";

// PDFMe Designer Theme
const theme = {
  token: {
    colorPrimary: "#FF7961",
    colorTextBase: "#042D45",
    colorBgLayout: "#FFFFFF",
    colorBgMask: "#042D45",
  },
};

export function usePdfMe(
  designerContainerRef?: React.MutableRefObject<HTMLDivElement | null>,
  initialTemplate?: PdfMeTypes.Template,
) {
  const templatesHook = useTemplates();
  const designer = useRef<PdfMeTypes.Designer | null>(null);

  useEffect(() => {
    if (designerContainerRef && !designer.current) {
      const domContainer = designerContainerRef.current;

      if (domContainer)
        designer.current = new PdfMeService.Designer({
          domContainer,
          template: initialTemplate ?? TemplateService.defaultTemplate,
          options: {
            font: FontService.getPdfMeFonts(),
            theme: theme,
          },
          plugins: PdfMeService.plugins,
        });
    }
  });

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

  async function onSaveTemplate(name: string) {
    if (!designer.current) throw new Error("Designer is not initialized");

    const template = designer.current.getTemplate();

    templatesHook.postTemplate({
      name: name,
      templateJson: JSON.stringify(template),
    });
  }

  async function loadTemplate(template: BackendTypes.Template) {
    if (!designer.current) throw new Error("Designer is not initialized");

    if (!template) {
      console.log("Template dosen't exist!");
      return;
    }

    const pdfMeTemplate: PdfMeTypes.Template = JSON.parse(
      template.templateJson,
    );

    PdfMeService.checkTemplate(pdfMeTemplate);

    designer.current.updateTemplate(pdfMeTemplate);
  }

  function onResetTemplate() {
    if (!designer.current) throw new Error("Designer is not initialized");

    designer.current.updateTemplate(
      initialTemplate ?? TemplateService.defaultTemplate,
    );
  }

  function loadBlankTemplate() {
    if (!designer.current) throw new Error("Designer is not initialized");

    designer.current.updateTemplate(TemplateService.defaultTemplate);
  }

  function handleReloadFonts() {
    if (!designer.current) throw new Error("Designer is not initialized");

    designer.current.updateOptions({ font: FontService.getPdfMeFonts() });
  }

  async function generatePdf(inputs: TemplateTypes.Substitions) {
    if (!designer.current) throw new Error("Designer is not initialized");

    const template = designer.current.getTemplate();

    const substitutedInputs = TemplateService.substitutePlaceholdersWithContent(
      template,
      inputs,
    );

    const pdf = await PdfMeService.generate({
      template,
      plugins: PdfMeService.plugins,
      inputs: substitutedInputs,
    });

    const blob = new Blob([pdf.buffer], { type: "application/pdf" });

    //temporary, should not work like this by default later
    // window.open(URL.createObjectURL(blob));

    return blob;
  }

  async function downloadTemplate() {
    if (!designer.current) throw new Error("Designer is not initialized");

    const template = designer.current.getTemplate();

    FileService.downloadJsonFile(template, "template");
  }

  const getTemplateJson = () => {
    if (!designer.current) throw new Error("Designer is not initialized");

    return JSON.stringify(designer.current.getTemplate());
  };

  return {
    handleLoadTemplate,
    onChangeBasePdf,
    onResetTemplate,
    handleReloadFonts,
    onSaveTemplate,
    loadBlankTemplate,
    loadTemplate,
    generatePdf,
    downloadTemplate,
    getTemplateJson,
  };
}
