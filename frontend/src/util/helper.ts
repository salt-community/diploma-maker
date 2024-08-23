import { Template, Font, checkTemplate } from "@pdfme/common";
import { Form, Viewer, Designer } from "@pdfme/ui";
import { generate } from "@pdfme/generator";
import { text, barcodes, image } from "@pdfme/schemas"
import plugins from "../plugins"
import { PDFDocument } from "pdf-lib";
import { BootcampResponse, pdfGenerationResponse, SaltData, Size, Student, studentImagePreview, StudentResponse, TemplateResponse, TrackResponse, UserFontResponseDto } from "./types";
import { useLoadingMessage } from "../components/Contexts/LoadingMessageContext";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { getFontsData } from "./fontsUtil";
import { api } from "./apiUtil";

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

export const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

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



export async function openIndexedTemplatesDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
      const request = indexedDB.open('pdfCache', 1);

      request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('pdfs')) {
              db.createObjectStore('pdfs', { keyPath: 'id' });
          }
      };

      request.onsuccess = () => {
          resolve(request.result);
      };

      request.onerror = () => {
          reject(request.error);
      };
  });
}

export async function getFromIndexedTemplatesDB(db: IDBDatabase, key: string): Promise<any> {
  return new Promise((resolve, reject) => {
      const transaction = db.transaction('pdfs', 'readonly');
      const store = transaction.objectStore('pdfs');
      const request = store.get(key);

      request.onsuccess = () => {
          resolve(request.result);
      };

      request.onerror = () => {
          reject(request.error);
      };
  });
}

export async function storeInIndexedTemplatesDB(db: IDBDatabase, key: string, data: any): Promise<void> {
  return new Promise(async (resolve, reject) => {
      const transaction = db.transaction('pdfs', 'readwrite');
      const store = transaction.objectStore('pdfs');

      const countRequest = store.count();
      countRequest.onsuccess = async () => {
          const count = countRequest.result;

          if (count >= 25) {
              const cursorRequest = store.openCursor();
              cursorRequest.onsuccess = (event) => {
                  const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
                  if (cursor) {
                      store.delete(cursor.primaryKey);
                      cursor.continue();
                  }
              };
          }

          const putRequest = store.put(data);
          putRequest.onsuccess = () => {
              resolve();
          };
          putRequest.onerror = () => {
              reject(putRequest.error);
          };
      };

      countRequest.onerror = () => {
          reject(countRequest.error);
      };
  });
}