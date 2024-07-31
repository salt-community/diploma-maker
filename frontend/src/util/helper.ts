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
    label: "notoSerifJP-regular",
    url: "/fonts/NotoSerifJP-Regular.otf",
  },
  {
    fallback: false,
    label: "notoSerifJP-regular-bold",
    url: "https://fonts.cdnfonts.com/s/12165/Roboto-Bold.woff",
  },
  {
    fallback: false,
    label: "notoSerifJP-regular-italic",
    url: "https://fonts.cdnfonts.com/s/12165/Roboto-Italic.woff",
  },
  {
    fallback: false,
    label: "basilia-bold",
    url: "/fonts/Basilia-Bold.woff",
  },
  {
    fallback: false,
    label: "basilia-italic",
    url: "/fonts/Basilia-Italic.woff",
  },
  {
    fallback: false,
    label: "basilia",
    url: "/fonts/Basilia-Reg.woff",
  },
  {
    fallback: false,
    label: "futura-bold",
    url: "/fonts/Futura-Dem-Bold.woff",
  },
  {
    fallback: false,
    label: "futura-italic",
    url: "/fonts/Futura-Dem-Italic.woff",
  },
  {
    fallback: false,
    label: "futura",
    url: "/fonts/Futura-Dem.woff",
  },
  {
    fallback: false,
    label: "montserrat",
    url: "/fonts/Montserrat-Regular.ttf",
  },
  {
    fallback: false,
    label: "montserrat-bold",
    url: "/fonts/Montserrat-Bold.ttf",
  },
  {
    fallback: false,
    label: "montserrat-italic",
    url: "/fonts/Montserrat-Italic.ttf",
  },
  {
    fallback: false,
    label: "museosans",
    url: "/fonts/MuseoSans_500.woff",
  },
  {
    fallback: false,
    label: "museosans-bold",
    url: "/fonts/MuseoSans_500-Bold.woff",
  },
  {
    fallback: false,
    label: "museosans-italic",
    url: "/fonts/MuseoSans_500-Italic.otf",
  },
  {
    fallback: false,
    label: "ttcorals",
    url: "/fonts/TT-Corals-Regular.woff",
  },
  {
    fallback: false,
    label: "ttcorals-bold",
    url: "/fonts/TT-Corals-Bold.woff",
  },
  {
    fallback: false,
    label: "ttcorals-italic",
    url: "/fonts/TT-Corals-Italic.woff",
  },
  {
    fallback: false,
    label: "bison",
    url: "/fonts/Basilia-Reg.woff",
  },
  {
    fallback: false,
    label: "bison-bold",
    url: "/fonts/Bison-Bold.woff",
  },
  {
    fallback: false,
    label: "bison-italic",
    url: "/fonts/Basilia-Italic.woff",
  },
  {
    fallback: false,
    label: "arial",
    url: "https://fonts.cdnfonts.com/s/29105/ARIAL.woff",
  },
  {
    fallback: false,
    label: "arial-bold",
    url: "https://fonts.cdnfonts.com/s/29105/ARIALBD.woff",
  },
  {
    fallback: false,
    label: "arial-italic",
    url: "https://fonts.cdnfonts.com/s/29105/ARIALI.woff",
  },
  {
    fallback: false,
    label: "overpass",
    url: "https://fonts.cdnfonts.com/s/12274/Overpass_Regular.woff",
  },
  {
    fallback: false,
    label: "overpass-bold",
    url: "https://fonts.cdnfonts.com/s/12274/Overpass_Bold.woff",
  },
  {
    fallback: false,
    label: "overpass-italic",
    url: "https://fonts.cdnfonts.com/s/12274/overpassitalic.woff",
  },
  {
    fallback: false,
    label: "roboto",
    url: "https://fonts.cdnfonts.com/s/12165/Roboto-Regular.woff",
  },
  {
    fallback: false,
    label: "roboto-bold",
    url: "https://fonts.cdnfonts.com/s/12165/Roboto-Bold.woff",
  },
  {
    fallback: false,
    label: "roboto-italic",
    url: "https://fonts.cdnfonts.com/s/12165/Roboto-Italic.woff",
  },
  {
    fallback: false,
    label: "rubik",
    url: "https://fonts.cdnfonts.com/s/15684/Rubik-Regular.woff",
  },
  {
    fallback: false,
    label: "rubik-bold",
    url: "https://fonts.cdnfonts.com/s/15684/Rubik-Bold.woff",
  },
  {
    fallback: false,
    label: "rubik-italic",
    url: "https://fonts.cdnfonts.com/s/15684/Rubik-Italic.woff",
  },
  {
    fallback: false,
    label: "brcobane",
    url: "https://fonts.cdnfonts.com/s/107551/BRCobane-Regular-BF654d96a1718fa.woff",
  },
  {
    fallback: false,
    label: "brcobane-bold",
    url: "https://fonts.cdnfonts.com/s/107551/BRCobane-Bold-BF654d96a1ac1b0.woff",
  },
  {
    fallback: false,
    label: "brcobane-italic",
    url: "https://fonts.cdnfonts.com/s/107551/BRCobane-RegularItalic-BF654d96a1a8637.woff",
  },
  {
    fallback: false,
    label: "calibri",
    url: "https://fonts.gstatic.com/l/font?kit=J7afnpV-BGlaFfdAhLEY6w&skey=a1029226f80653a8&v=v15",
  },
  {
    fallback: false,
    label: "calibri-bold",
    url: "https://fonts.gstatic.com/l/font?kit=J7aanpV-BGlaFfdAjAo9_pxqHw&skey=cd2dd6afe6bf0eb2&v=v15",
  },
  {
    fallback: false,
    label: "calibri-italic",
    url: "https://fonts.gstatic.com/l/font?kit=J7adnpV-BGlaFfdAhLQo6btP&skey=36a3d5758e0e2f58&v=v15",
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
      classname: bootcamp.name ,
      dategraduate: bootcamp.graduationDate.toString().slice(0, 10),
      students: bootcamp.students,
      template: template
  };
}

export function mapBootcampToSaltData2(TrackName: string, bootcamp: BootcampResponse, template: TemplateResponse ): SaltData {
  return {
      guidId: bootcamp.guidId,
      classname: bootcamp.name ,
      dategraduate: bootcamp.graduationDate.toString().slice(0, 10),
      students: bootcamp.students,
      template: template,
      displayName: "Fullstack " + TrackName 
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
  second: 'numeric',
  timeZone: 'Europe/Stockholm'
};

export const dateFormatter = new Intl.DateTimeFormat('en-GB', dateoptions);

export const utcFormatter = (date: Date) => {
  const utcDate = new Date(date);
  const stockholmDateString = dateFormatter.format(utcDate);
  return stockholmDateString;
}

export const utcFormatterSlash = (date: Date) => {
  const dateConverted = new Date(date);
  const utcYear = dateConverted.getUTCFullYear();
  const utcMonth = (dateConverted.getUTCMonth() + 1).toString().padStart(2, '0');
  const utcDay = dateConverted.getUTCDate().toString().padStart(2, '0');
  return `${utcYear}-${utcMonth}-${utcDay}`;
}