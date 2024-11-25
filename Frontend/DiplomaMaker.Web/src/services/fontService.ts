/* 
Font Service

Collection of functions related to managing user fonts to be used in PdfMe.
*/

import { PdfMeService } from '@/services';
import type { PdfMeTypes } from '@/services';

export namespace FontTypes {
  export type PdfMeFont = {
    fallback: boolean;
    label: string;
    data: string | ArrayBuffer;
  };

  export type GoogleFont = {
    family: string;
    variants: Record<number, string>;
    files: Record<string, string>;
  };

  export type GoogleFontsResponse = {
    items: GoogleFont[];
  };
}

const SAVED_FONTS_KEY = 'fonts';

// Fetches all available fonts(urls) from Google Fonts
export async function fetchGoogleFonts() {
  const apiResponse = await fetch(
    `https://www.googleapis.com/webfonts/v1/webfonts?key=${import.meta.env.VITE_GOOGLE_FONTS_API_KEY}`
  );

  if (!apiResponse.ok) {
    throw new Error('Could not fetch Google Fonts.');
  }

  const fontsResponse = (await apiResponse.json()) as FontTypes.GoogleFontsResponse;
  return fontsResponse.items;
}

// Returns saved fonts from localstorage
export function getSavedFonts(): FontTypes.GoogleFont[] {
  const savedFontsRaw = localStorage.getItem(SAVED_FONTS_KEY);
  return savedFontsRaw ? JSON.parse(savedFontsRaw) : [];
}

// Saves font info to localstorage to be used when loading fonts to PdfMe.
export async function saveFont(font: FontTypes.GoogleFont) {
  const savedFonts = getSavedFonts();

  savedFonts.push(font);

  localStorage.setItem(SAVED_FONTS_KEY, JSON.stringify(savedFonts));
}

// Removes saved font from localstorage
export async function removeFont(font: FontTypes.GoogleFont) {
  const savedFonts = getSavedFonts();

  const filteredFonts = savedFonts.filter((f) => f.family != font.family);

  localStorage.setItem(SAVED_FONTS_KEY, JSON.stringify(filteredFonts));
}

// Returns saved user fonts in a format that PdfMe expects.
export function getPdfMeFonts() {
  const savedFonts = getSavedFonts();

  // Translate saved font and all its variants to PdfMe type
  const fonts: FontTypes.PdfMeFont[] = savedFonts.flatMap((font) =>
    Object.entries(font.files).map(([key, value]) => ({
      fallback: false,
      label: `${font.family}-${key}`,
      data: value,
    }))
  );

  // Adds default PdfMe Roboto font as fallback.
  fonts.push({
    fallback: true,
    label: PdfMeService.DEFAULT_FONT_NAME,
    data: PdfMeService.getDefaultFont()[PdfMeService.DEFAULT_FONT_NAME].data,
  });

  return fonts.reduce(
    (acc, font) => ({ ...acc, [font.label]: font }),
    {} as PdfMeTypes.Font
  );
}
