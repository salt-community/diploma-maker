/*
    usePdfMe

    A hook that serves as a layer between PdfMe and any component
    that wishes to use its functionality.
*/

import { useEffect, useRef } from "react";

import { FileService, PdfMe, PdfMeTypes, TemplateService } from "../services";
import { getPdfMeFonts } from "../services/fontService";
import { Template } from "../api/models";
import { Endpoints } from "../api";
import { TemplateTextSubstitions } from "@/types/types";
import useEntity from "./useEntity";

export function usePdfMe(
  designerContainerRef?: React.MutableRefObject<HTMLDivElement | null>,
  initialTemplate?: PdfMeTypes.Template,
) {
  const templateEntities = useEntity<Template>("Template");
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
            font: getPdfMeFonts(),
          },
          plugins,
        });
    }
  });

  async function generatePdf(inputs: TemplateTextSubstitions) {
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

  function onDownloadTemplate() {
    if (!designer.current) throw new Error("Designer is not initialized");

    FileService.downloadJsonFile(designer.current.getTemplate(), "template");
  }

  async function onSaveTemplate() {
    if (!designer.current) throw new Error("Designer is not initialized");

    const template = designer.current.getTemplate();

    const result = await Endpoints.PostEntity<Template>("Template", {
      templateJson: JSON.stringify(template),
    });
  }

  async function onLoadTemplate() {
    if (!designer.current) throw new Error("Designer is not initialized");

    const templateEntity = templateEntities.entityByGuid(
      "ee0b62a1-685b-42b6-adb0-7f16b978bb31",
    );

    if (!templateEntity) {
      console.log("Template dosen't exist!");
      return;
    }

    const template: PdfMeTypes.Template = JSON.parse(templateEntity.templateJson);

    //PdfMe.checkTemplate(template);

    designer.current.updateTemplate(template);
  }

  function onResetTemplate() {
    if (!designer.current) throw new Error("Designer is not initialized");

    designer.current.updateTemplate(initialTemplate ?? defaultTemplate);
  }

  function handleReloadFonts() {
    if (!designer.current) throw new Error("Designer is not initialized");

    designer.current.updateOptions({ font: getPdfMeFonts() });
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
