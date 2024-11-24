/*
    usePdfMeViewer

    Renders a pdf preview in the supplied div element.
*/

import { useRef } from "react";

import { PdfMeService, TemplateService } from "@/services";
import type { PdfMeTypes, TemplateTypes } from "@/services";

export function usePdfMeViewer() {
  const viewer = useRef<PdfMeTypes.Viewer | null>(null);

  async function loadViewer(domContainer: HTMLDivElement, template: PdfMeTypes.Template, substitions: TemplateTypes.Substitions) {
    const inputs = TemplateService.substitutePlaceholdersWithContent(
      template,
      substitions
    ) as Record<string, any>[];

    viewer.current = new PdfMeService.Viewer({
      template,
      inputs,
      plugins: PdfMeService.plugins,
      domContainer
    });

    console.log(viewer);
  }

  return {
    loadViewer,
  };
}
