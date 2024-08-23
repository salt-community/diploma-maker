import { Font } from "@pdfme/common";
import { UserFontResponseDto } from "./types";
import { defaultFontsData } from "../data/fontData";
import { api } from "./apiUtil";

const fontCache = new Map<string, { label: string; url: string; data: ArrayBuffer }>();
let userFontsImport: UserFontResponseDto[]
let userFonts = []

const fetchUserFonts = async () => {
  userFontsImport = await api.getUserFonts();
  for (let i = 0; i < userFontsImport.length; i++) {
    const newFont = userFontsImport[i];
    userFonts.push({
      fallback: false,
      label: newFont.fileName,
      url: newFont.fileUrl,
    })
  }
}

let allFontsList;
(async () => {
  await fetchUserFonts();
  allFontsList = [...defaultFontsData, ...userFonts];
  await (logFontMimeTypes);
  await getFontsData();
})();



export const logFontMimeTypes = async () => {
  await Promise.all(
    allFontsList.map(async (font) => {
      try {
        const response = await fetch(font.url, { method: 'HEAD' });
        const contentType = response.headers.get('Content-Type');

        console.log(`Font: ${font.label}, MIME type: ${contentType}`);
      } catch (error) {
        console.error(`Failed to fetch MIME type for ${font.label}:`, error);
      }
    })
  );
};


export const getFontsData = async () => {
  const fontDataList = await Promise.all(
    allFontsList.map(async (font) => {
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

export const refreshUserFonts = async () => {
  userFonts = [];

  const userFontImports: UserFontResponseDto[] = await api.getUserFonts();

  userFontImports.forEach((newFont) => {
      userFonts.push({
          fallback: false,
          label: newFont.fileName,
          url: newFont.fileUrl,
      });
  });

  allFontsList = [...defaultFontsData, ...userFonts];

  fontCache.clear();

  await getFontsData();
};

const openFontsIndexedDB = () => {
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
    const db = await openFontsIndexedDB();
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
    const db = await openFontsIndexedDB();
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