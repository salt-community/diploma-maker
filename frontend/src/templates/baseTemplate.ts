import { Size, Template } from "@pdfme/common";
import { XYPosition } from "../util/types";

export const makeTemplateInput= (header: string, name: string, footer: string, pdfbase: string) => {
  return {
    name,
    header,
    footer,
    pdfbase,
  };
};

export const getTemplate = (
    input: { 
      header: string; name: string; footer: string; pdfbase: string }, 
      headerPos?: XYPosition, headerSize?: Size, headerFontSize?: number, headerFontColor?: string, headerFont?: string, headerAlignment?: string,
      namePos?: XYPosition, nameSize?: Size, nameFontSize?: number, nameFontColor?: string, nameFont?: string, nameAlignment?: string,
      footerPos?: XYPosition, footerSize?: Size, footerFontSize?: number, footerFontColor?: string, footerFont?: string, footerAlignment?: string
    ): Template => ({
  
  schemas: [
    {
      footer: {
        type: "text",
        position: footerPos || { x: 35.08, y: 135.72 },
        width: footerSize?.width || 145.76,
        height: footerSize?.height || 21.08,
        rotate: 0,
        fontSize: footerFontSize || 16,
        fontColor: footerFontColor || "#ffffff",
        fontName: footerFont || "NotoSerifJP-Regular",
        alignment: footerAlignment || "center",
      },
      header: {
        type: "text",
        position: headerPos || { x: 83.89, y: 98.63 },
        width: headerSize?.width || 48.13,
        height: headerSize?.height || 10.23,
        rotate: 0,
        fontSize: headerFontSize || 16,
        fontColor: headerFontColor || "#ffffff",
        fontName: headerFont || "NotoSerifJP-Regular",
        alignment: headerAlignment || "center",
      },
      name: {
        type: "text",
        position: namePos || { x: 35.08, y: 113.4 },
        width: nameSize?.width || 145.76,
        height: nameSize?.height || 16.83,
        rotate: 0,
        fontSize: nameFontSize || 33,
        fontColor: nameFontColor || "#ffffff",
        fontName: nameFont || "NotoSerifJP-Regular",
        alignment: nameAlignment || "center",
      },
    },
  ],
  basePdf: input.pdfbase,
  sampledata: [
    {
      footer: input.footer,
      header: input.header,
      name: input.name,
    }
  ],
  columns: ["footer", "header", "name"],
});
