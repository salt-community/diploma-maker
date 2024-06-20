import { Template, Font, checkTemplate } from "@pdfme/common";
import { Form, Viewer, Designer } from "@pdfme/ui";
import { generate } from "@pdfme/generator";
import { text, barcodes, image } from "@pdfme/schemas"
import plugins from "../plugins"

const fontObjList = [
  {
    fallback: true,
    label: "NotoSerifJP-Regular",
    url: "/fonts/NotoSerifJP-Regular.otf",
  },
  {
    fallback: false,
    label: "NotoSansJP-Regular",
    url: "/fonts/NotoSansJP-Regular.otf",
  },
];

export const getFontsData = async () => {
  const fontDataList = await Promise.all(
    fontObjList.map(async (font) => ({
      ...font,
      data: await fetch(font.url).then((res) => res.arrayBuffer()),
    }))
  );

  return fontDataList.reduce(
    (acc, font) => ({ ...acc, [font.label]: font }),
    {} as Font
  );
};

export const readFile = (
  file: File | null,
  type: "text" | "dataURL" | "arrayBuffer"
) => {
  return new Promise<string | ArrayBuffer>((r) => {
    const fileReader = new FileReader();
    fileReader.addEventListener("load", (e) => {
      if (e && e.target && e.target.result && file !== null) {
        r(e.target.result);
      }
    });
    if (file !== null) {
      if (type === "text") {
        fileReader.readAsText(file);
      } else if (type === "dataURL") {
        fileReader.readAsDataURL(file);
      } else if (type === "arrayBuffer") {
        fileReader.readAsArrayBuffer(file);
      }
    }
  });
};

export const cloneDeep = (obj: any) => JSON.parse(JSON.stringify(obj));

const getTemplateFromJsonFile = (file: File) => {
  return readFile(file, "text").then((jsonStr) => {
    const template: Template = JSON.parse(jsonStr as string);
    try {
      checkTemplate(template);
      return template;
    } catch (e) {
      throw e;
    }
  });
};

export const downloadJsonFile = (json: any, title: string) => {
  if (typeof window !== "undefined") {
    const blob = new Blob([JSON.stringify(json)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
};

export const handleLoadTemplate = (
  e: React.ChangeEvent<HTMLInputElement>,
  currentRef: Designer | Form | Viewer | null
) => {
  if (e.target && e.target.files) {
    getTemplateFromJsonFile(e.target.files[0])
      .then((t) => {
        if (!currentRef) return;
        currentRef.updateTemplate(t);
      })
      .catch((e) => {
        alert(`Invalid template file.
        --------------------------
        ${e}`);
              });
          }
};

export const getPlugins = () => {
  return {
    Text: text,
    Signature: plugins.signature,
    QR: barcodes.qrcode,
    Image: image,
  }
}

export const generatePDF = async (template: Template, inputs: any) => {
  if(!template) return;
  const font = await getFontsData();

  const pdf = await generate({
    template,
    inputs,
    options: { font },
    plugins: getPlugins(),
  });

  const blob = new Blob([pdf.buffer], { type: "application/pdf" });
  window.open(URL.createObjectURL(blob));
};

export const generateCombinedPDF = async (templates: Template[], inputsArray: any[]) => {
  const font = await getFontsData();

  const combinedTemplate: Template = {
    ...templates[0],
    schemas: templates.flatMap(template => template.schemas),
    sampledata: inputsArray.flat(),
  };

  const pdf = await generate({
    template: combinedTemplate,
    // @ts-ignore
    inputs: combinedTemplate.sampledata,
    options: { font },
    plugins: getPlugins(),
  });

  const blob = new Blob([pdf.buffer], { type: "application/pdf" });
  window.open(URL.createObjectURL(blob));
}

export const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};



export const populateIntroField = (input: string): string => {
  return input
}

export const populateNameField = (input: string, studentname: string): string => {
  return input
    .replace('{studentname}', studentname)
}

export const populateFooterField = (input: string, classname: string, datebootcamp: string): string => {
  return input
    .replace('${classname}', classname)
    .replace('${datebootcamp}', datebootcamp);
}
  
    
    