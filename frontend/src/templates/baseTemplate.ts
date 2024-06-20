import { Template } from "@pdfme/common";

export const makeTemplateInput= (header: string, name: string, footer: string, pdfbase: string) => {
  return {
    name,
    header,
    footer,
    pdfbase,
  };
};

export const getTemplate = (input: { header: string; name: string; footer: string; pdfbase: string }): Template => ({
  schemas: [
    {
      footer: {
        type: "text",
        position: { x: 35.08, y: 135.72 },
        width: 145.76,
        height: 21.08,
        rotate: 0,
        fontSize: 16,
        fontColor: "#ffffff",
        fontName: "NotoSerifJP-Regular",
        alignment: "center",
      },
      header: {
        type: "text",
        position: { x: 83.89, y: 98.63 },
        width: 48.13,
        height: 10.23,
        rotate: 0,
        fontSize: 16,
        fontColor: "#ffffff",
        fontName: "NotoSerifJP-Regular",
      },
      name: {
        type: "text",
        position: { x: 35.08, y: 113.4 },
        width: 145.76,
        height: 16.83,
        rotate: 0,
        fontSize: 33,
        fontColor: "#ffffff",
        fontName: "NotoSerifJP-Regular",
        alignment: "center",
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
