/*
    usePdfMeViewer

    A hook that serves as a layer between PdfMe and any component
    that wishes to use its functionality.
*/

import { useEffect, useRef } from "react";
import { FontService, PdfMe, PdfMeTypes, TemplateService } from "../services";
import { BackendServiceTypes } from "../services/backendService";
import { useTemplates } from "./useTemplates";
import { Viewer } from "@pdfme/ui";
import { BLANK_PDF, Template } from "@pdfme/common";

export function usePdfMeViewer(
  viewerContainerRef?: React.MutableRefObject<HTMLDivElement | null>,
  initialTemplate?: PdfMeTypes.Template,
) {
  const templatesHook = useTemplates();
  const viewer = useRef<PdfMeTypes.Viewer | null>(null);

  const plugins = {
    Text: PdfMe.text,
    QR: PdfMe.barcodes.qrcode,
    Image: PdfMe.image,
  };

  // useEffect(() => {
  //   if (viewerContainerRef && !viewer.current) {
  //     const domContainer = viewerContainerRef.current;
  //     // const template = TemplateService.defaultTemplate;
  //     const template: Template = {
  //       basePdf: BLANK_PDF,
  //       schemas: [
  //         [
  //           {
  //             name: 'a',
  //             type: 'text',
  //             position: { x: 0, y: 0 },
  //             width: 10,
  //             height: 10,
  //           },
  //           {
  //             name: 'b',
  //             type: 'text',
  //             position: { x: 10, y: 10 },
  //             width: 10,
  //             height: 10,
  //           },
  //           {
  //             name: 'c',
  //             type: 'text',
  //             position: { x: 20, y: 20 },
  //             width: 10,
  //             height: 10,
  //           },
  //         ],
  //       ],
  //     };

  // const inputs = [{ a: 'a1', b: 'b1', c: 'c1' }];
  // const inputs = [{
  //   "field1": "gjdsaklgöjs",
  //   "field1 copy": "fjdsaklöfds",
  //   "field1 copy 2": "jfdkslöafjsl",
  //   "field4": "fjdsklöafj",
  //   "field5": "jfklödsajkl"
  // }];

  //     const inputs = TemplateService.substitutePlaceholdersWithContent(
  //       template,
  //       {
  //         "{studentName}": "Fredrik"
  //       }
  //     );

  //     console.log(inputs);

  //     if (domContainer)
  //       viewer.current = new Viewer({
  //         template,
  //         inputs,
  //         plugins,
  //         domContainer
  //       });
  //   }
  // }, [viewerContainerRef]);

  async function generatePdf(inputs: Record<string, string>) {
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

  async function onLoadTemplate(template: BackendServiceTypes.Template) {
    if (!template) {
      console.log("Template dosen't exist!");
      return;
    }

    const pdfMeTemplate: PdfMeTypes.Template = JSON.parse(
      template.templateJson,
    );

    PdfMe.checkTemplate(pdfMeTemplate);

    if (viewerContainerRef) {
      const domContainer = viewerContainerRef.current;

      const inputs = TemplateService.substitutePlaceholdersWithContent(
        pdfMeTemplate,
        {
          studentName: "Fredrik",
          track: "C#",
          graduationDate: new Date(Date.now()).toDateString(),
          qrLink: "www.google.com"
        }
      ) as Record<string, any>[];

      console.log(inputs);

      if (domContainer) {
        console.log("resetting viewer");
        viewer.current = new Viewer({
          template: pdfMeTemplate,
          inputs,
          plugins,
          domContainer
        });
      }
    }
  }

  function handleReloadFonts() {
    if (!viewer.current) throw new Error("Designer is not initialized");

    viewer.current.updateOptions({ font: FontService.getPdfMeFonts() });
  }

  return {
    generatePdf,
    handleReloadFonts,
    onLoadTemplate,
  };
}
