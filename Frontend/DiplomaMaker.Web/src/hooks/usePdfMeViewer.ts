/*
    usePdfMeViewer

    A hook that serves as a layer between PdfMe and any component
    that wishes to use its functionality.
*/

import { useRef } from "react";
import { FontService, PdfMe, PdfMeTypes, TemplateService } from "../services";
import { BackendServiceTypes } from "../services/backendService";
import { Viewer } from "@pdfme/ui";

export function usePdfMeViewer(
  viewerContainerRef: React.MutableRefObject<HTMLDivElement | null>,
) {
  const viewer = useRef<PdfMeTypes.Viewer | null>(null);

  const plugins = {
    Text: PdfMe.text,
    QR: PdfMe.barcodes.qrcode,
    Image: PdfMe.image,
  };

  async function generatePdf(inputs: TemplateService.Substitions) {
    if (!viewer.current) throw new Error("Designer is not initialized");

    const template = viewer.current.getTemplate();

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

  async function loadViewer(template: BackendServiceTypes.Template, substitions: TemplateService.Substitions) {
    if (!viewerContainerRef.current)
      throw new Error("Viewer container element is not referenced");

    const pdfMeTemplate: PdfMeTypes.Template = JSON.parse(
      template.templateJson,
    );

    PdfMe.checkTemplate(pdfMeTemplate);

    const inputs = TemplateService.substitutePlaceholdersWithContent(
      pdfMeTemplate,
      substitions
    ) as Record<string, any>[];

    viewer.current = new Viewer({
      template: pdfMeTemplate,
      inputs,
      plugins,
      domContainer: viewerContainerRef.current
    });
  }

  function handleReloadFonts() {
    if (!viewer.current) throw new Error("Designer is not initialized");

    viewer.current.updateOptions({ font: FontService.getPdfMeFonts() });
  }

  return {
    generatePdf,
    handleReloadFonts,
    loadViewer,
  };
}
