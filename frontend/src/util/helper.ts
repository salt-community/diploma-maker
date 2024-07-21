import { Template, Font, checkTemplate } from "@pdfme/common";
import { Form, Viewer, Designer } from "@pdfme/ui";
import { generate } from "@pdfme/generator";
import { text, barcodes, image } from "@pdfme/schemas"
import plugins from "../plugins"
import { PDFDocument } from "pdf-lib";
import { BootcampResponse, SaltData, TemplateResponse } from "./types";

const fontObjList = [
  {
    fallback: true,
    label: "NotoSerifJP-Regular",
    url: "/fonts/NotoSerifJP-Regular.otf",
  },
  {
    fallback: false,
    label: "Calibre",
    url: "/fonts/CalibreRegular.woff",
  },
  {
    fallback: false,
    label: "Basilia",
    url: "/fonts/Basilia-Reg.woff",
  },
  {
    fallback: false,
    label: "Futura",
    url: "/fonts/Futura-Dem.woff",
  },
  {
    fallback: false,
    label: "Museo-Sans",
    url: "/fonts/MuseoSans_500.woff",
  },
  {
    fallback: false,
    label: "Roboto",
    url: "/fonts/Roboto-Regular.woff",
  },
  {
    fallback: false,
    label: "TT-Corals",
    url: "/fonts/TT-Corals Regular.woff",
  },
];

const fontCache = new Map<string, { label: string; url: string; data: ArrayBuffer }>();

export const getFontsData = async () => {
  const fontDataList = await Promise.all(
    fontObjList.map(async (font) => {
      if (!fontCache.has(font.label)) {
        let data = await getFontFromIndexedDB(font.label);
        if (!data) {
          data = await fetch(font.url).then((res) => res.arrayBuffer());
          await storeFontInIndexedDB(font.label, data);
        }
        fontCache.set(font.label, { ...font, data });
      }
      return fontCache.get(font.label);
    })
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

export const generatePDF = async (template: Template, inputs: any, returnFile?: boolean): Promise<Blob | void> => {
  if(!template) return;
  const font = await getFontsData();
 
  const pdf = await generate({
    template,
    inputs,
    options: { font },
    plugins: getPlugins(),
  });

  const blob = new Blob([pdf.buffer], { type: "application/pdf" });
  if(returnFile){
    return blob;
  }
  else{
    window.open(URL.createObjectURL(blob));
  }
};

export const generatePDFDownload = async (template: Template, inputs: any, fileName: string): Promise<void> => {
  if (!template) return;
  const font = await getFontsData();

  const pdf = await generate({
    template,
    inputs,
    options: { font },
    plugins: getPlugins(),
  });

  const blob = new Blob([pdf.buffer], { type: "application/pdf" });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const oldGenerateCombinedPDF = async (templates: Template[], inputsArray: any[]) => {
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


export const newGenerateCombinedPDF = async (templates: Template[], inputsArray: any[]) => {
  const font = await getFontsData();
  const mergedPdf = await PDFDocument.create();

  for (let i = 0; i < templates.length; i++) {
    const pdf = await generate({
      template: templates[i],
      inputs: [inputsArray[i]],
      options: { font },
      plugins: getPlugins(),
    });
    const loadedPdf = await PDFDocument.load(pdf);
    const copiedPages = await mergedPdf.copyPages(loadedPdf, loadedPdf.getPageIndices());
    copiedPages.forEach(page => mergedPdf.addPage(page));
  }

  const mergedPdfBytes = await mergedPdf.save();
  const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
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

export const populateField = (input: string, classname: string, datebootcamp: string, studentname: string): string => {
  return input
    .replace('{classname}', classname)
    .replace('{datebootcamp}', datebootcamp)
    .replace('{studentname}', studentname)
}

export const populateIdField = (input: string, verificationCode: string): string => {
  return input
    .replace('{id}', verificationCode)
}

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function mapBootcampToSaltData(bootcamp: BootcampResponse, template: TemplateResponse ): SaltData {
  return {
      guidId: bootcamp.guidId,
      classname: bootcamp.name,
      dategraduate: bootcamp.graduationDate.toString().slice(0, 10),
      students: bootcamp.students,
      template: template
  };
}

const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('fontDatabase', 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore('fonts');
    };

    request.onsuccess = (event: Event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event: Event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

const storeFontInIndexedDB = async (label: string, fontData: ArrayBuffer) => {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(['fonts'], 'readwrite');
    const store = transaction.objectStore('fonts');
    const request = store.put(fontData, label);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event: Event) => {
      reject((event.target as IDBRequest).error);
    };
  });
};

const getFontFromIndexedDB = async (label: string): Promise<ArrayBuffer | null> => {
  const db = await openDB();
  return new Promise<ArrayBuffer | null>((resolve, reject) => {
    const transaction = db.transaction(['fonts'], 'readonly');
    const store = transaction.objectStore('fonts');
    const request = store.get(label);

    request.onsuccess = (event: Event) => {
      resolve((event.target as IDBRequest).result as ArrayBuffer | null);
    };

    request.onerror = (event: Event) => {
      reject((event.target as IDBRequest).error);
    };
  });
};


export const generateVerificationCode = (length = 5) => {
  const guid = URL.createObjectURL(new Blob()).slice(-36).replace(/-/g, '');

  const chars = guid.split('');

  const random = () => Math.floor(Math.random() * chars.length);

  let code = '';
  for (let i = 0; i < length; i++) {
      code += chars[random()];
  }

  return code;
}


const dateoptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZone: 'Europe/Stockholm',
  timeZoneName: 'short'
};

export const dateFormatter = new Intl.DateTimeFormat('en-GB', dateoptions);

export const utcFormatter = (date: Date) => {
  const utcDate = new Date(date);
  const stockholmDateString = dateFormatter.format(utcDate);
  return stockholmDateString
}