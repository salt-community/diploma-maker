import { Size, Template } from "@pdfme/common";
import { XYPosition } from "../util/types";

export const makeTemplateInput= (header: string, main: string, footer: string, pdfbase: string, link: string) => {
  return {
    main,
    header,
    footer,
    pdfbase,
    link,
  };
};

const checkPosition = (pos?: XYPosition): XYPosition | undefined => {
  return (pos?.x !== null && pos?.y !== null) ? pos : undefined;
};

export const getTemplate = (
  input: { 
    header: string; main: string; footer: string; pdfbase: string, link: string }, 
    headerPos?: XYPosition, headerSize?: Size, headerFontSize?: number, headerFontColor?: string, headerFont?: string, headerAlignment?: string,
    mainPos?: XYPosition, mainSize?: Size, mainFontSize?: number, mainFontColor?: string, mainFont?: string, mainAlignment?: string,
    footerPos?: XYPosition, footerSize?: Size, footerFontSize?: number, footerFontColor?: string, footerFont?: string, footerAlignment?: string,
    linkPos?: XYPosition, linkSize?: Size, linkFontSize?: number, linkFontColor?: string, linkFont?: string, linkAlignment?: string
  ): Template => ({

schemas: [
  {
    footer: {
      type: "text",
      //@ts-ignore
      position: checkPosition(footerPos) ?? { x: 35.08, y: 135.72 },
      //@ts-ignore
      width: footerSize?.width !== null ? footerSize.width : 145.76,
      //@ts-ignore
      height: footerSize?.height !== null ? footerSize.height : 21.08,
      rotate: 0,
      fontSize: footerFontSize !== null ? footerFontSize : 16,
      fontColor: footerFontColor !== null ? footerFontColor : "#ffffff",
      fontName: footerFont !== null ? footerFont : "notoSerifJP-regular",
      alignment: footerAlignment !== null ? footerAlignment : "center",
    },
    header: {
      type: "text",
      //@ts-ignore
      position: checkPosition(headerPos) ?? { x: 83.89, y: 98.63 },
      //@ts-ignore
      width: headerSize?.width !== null ? headerSize.width : 48.13,
      //@ts-ignore
      height: headerSize?.height !== null ? headerSize.height : 10.23,
      rotate: 0,
      fontSize: headerFontSize !== null ? headerFontSize : 16,
      fontColor: headerFontColor !== null ? headerFontColor : "#ffffff",
      fontName: headerFont !== null ? headerFont : "notoSerifJP-regular",
      alignment: headerAlignment !== null ? headerAlignment : "center",
    },
    main: {
      type: "text",
      //@ts-ignore
      position: checkPosition(mainPos) ?? { x: 35.08, y: 113.4 },
      //@ts-ignore
      width: mainSize?.width !== null ? mainSize.width : 145.76,
      //@ts-ignore
      height: mainSize?.height !== null ? mainSize.height : 16.83,
      rotate: 0,
      fontSize: mainFontSize !== null ? mainFontSize : 33,
      fontColor: mainFontColor !== null ? mainFontColor : "#ffffff",
      fontName: mainFont !== null ? mainFont : "notoSerifJP-regular",
      alignment: mainAlignment !== null ? mainAlignment : "center",
    },
    link: {
      type: "text",
      //@ts-ignore
      position: checkPosition(linkPos) ?? { x: 190, y: 290 },
      //@ts-ignore
      width: linkSize?.width !== null ? linkSize.width : 20,
      //@ts-ignore
      height: linkSize?.height !== null ? linkSize.height : 8,
      rotate: 0,
      fontSize: linkFontSize !== null ? linkFontSize : 14,
      fontColor: linkFontColor !== null ? linkFontColor : "#ffffff",
      fontName: linkFont !== null ? linkFont : "notoSerifJP-regular",
      alignment: linkAlignment !== null ? linkAlignment : "center",
    },
  },
],
basePdf: input.pdfbase,
sampledata: [
  {
    footer: input.footer,
    header: input.header,
    main: input.main,
    link: input.link
  }
],
columns: ["footer", "header", "main", "link"],
});