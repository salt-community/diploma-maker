import { Font } from "@pdfme/common";
import { UserFontResponseDto } from "./types";
import { defaultFontsData } from "../data/fontData";
import { api } from "./apiUtil";
import { getFontFromIndexedDB, storeFontInIndexedDB } from "./browserStorageUtil";

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