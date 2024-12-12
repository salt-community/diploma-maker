/*
    usePdfMeViewer

    Renders a pdf preview in the supplied div element.
*/

import { useEffect, useRef } from "react";

import { PdfMeService, TemplateService } from "@/services";
import type { PdfMeTypes, TemplateTypes } from "@/services";
import { customPdfMeTheme } from "@/customPdfMeTheme";
import { usePdfMeFonts } from "@/hooks";

export function usePdfMeViewer() {
  const viewer = useRef<PdfMeTypes.Viewer | null>(null);

  const fonts = usePdfMeFonts();

  async function loadViewer(
    domContainer: HTMLDivElement,
    template: PdfMeTypes.Template,
    substitions: TemplateTypes.Substitions,
  ) {
    const inputs = TemplateService.substitutePlaceholdersWithContent(
      template,
      substitions,
    ) as Record<string, any>[];

    viewer.current = new PdfMeService.Viewer({
      template,
      inputs,
      plugins: PdfMeService.plugins,
      domContainer,
      options: {
        theme: customPdfMeTheme,
        font: fonts,
      },
    });
  }

  useEffect(() => {
    if (viewer.current) {
      viewer.current.updateOptions({ font: fonts });
    }
  }, [fonts]);

  return {
    loadViewer,
  };
}
