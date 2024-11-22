/*
    usePdfMeViewer

    A hook that serves as a layer between PdfMe and any component
    that wishes to use its functionality.
*/

import { useRef } from "react";

import { FontService, PdfMeService, TemplateService } from "../services";
import type { PdfMeTypes, BackendTypes, TemplateTypes } from "../services";

export function usePdfMeViewer(
  viewerContainerRef: React.MutableRefObject<HTMLDivElement | null>,
) {
  const viewer = useRef<PdfMeTypes.Viewer | null>(null);

  async function generatePdf(inputs: TemplateTypes.Substitions) {
    if (!viewer.current) throw new Error("Designer is not initialized");

    const template = viewer.current.getTemplate();

    const substitutedInputs = TemplateService.substitutePlaceholdersWithContent(
      template,
      inputs,
    );

    console.log(substitutedInputs);

    const pdf = await PdfMeService.generate({
      template,
      plugins: PdfMeService.plugins,
      inputs: substitutedInputs,
    });

    const blob = new Blob([pdf.buffer], { type: "application/pdf" });

    //temporary, should not work like this by default later
    window.open(URL.createObjectURL(blob));

    return blob;
  }

  async function loadViewer(template: BackendTypes.Template, substitions: TemplateTypes.Substitions) {
    if (!viewerContainerRef.current)
      throw new Error("Viewer container element is not referenced");

    const pdfMeTemplate: PdfMeTypes.Template = JSON.parse(
      template.templateJson,
    );

    PdfMeService.checkTemplate(pdfMeTemplate);

    const inputs = TemplateService.substitutePlaceholdersWithContent(
      pdfMeTemplate,
      substitions
    ) as Record<string, any>[];

    viewer.current = new PdfMeService.Viewer({
      template: pdfMeTemplate,
      inputs,
      plugins: PdfMeService.plugins,
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
