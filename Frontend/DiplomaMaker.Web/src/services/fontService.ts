import { PdfMe, PdfMeTypes } from '.';

/* 
  Font Service

 Collection of functions related to managing user fonts to be used in PdfMe.

*/

const SAVED_FONTS_KEY = 'fonts';

type PdfMeFont = {
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

// Fetches all available fonts(urls) from Google Fonts
export async function fetchGoogleFonts() {
  const apiResponse = await fetch(
    `https://www.googleapis.com/webfonts/v1/webfonts?key=${import.meta.env.VITE_GOOGLE_FONTS_API_KEY}`
  );

  if (!apiResponse.ok) {
    throw new Error('Could not fetch Google Fonts.');
  }

  const fontsResponse = (await apiResponse.json()) as GoogleFontsResponse;
  return fontsResponse.items;
}

// Saves font info to localstorage to be used when loading fonts to PdfMe.
export function saveFont(font: GoogleFont) {
  const savedFonts = getSavedFonts();

  savedFonts.push(font);

  localStorage.setItem(SAVED_FONTS_KEY, JSON.stringify(savedFonts));
}

export function removeFont(font: GoogleFont) {
  const savedFonts = getSavedFonts();
  const filteredFonts = savedFonts.filter((f) => f.family != font.family);
  localStorage.setItem(SAVED_FONTS_KEY, JSON.stringify(filteredFonts));
}

// Returns saved user fonts in a format that PdfMe expects.
export function getPdfMeFonts() {
  const savedFonts = getSavedFonts();

  // Translate saved font and all its variants to PdfMe type
  const fonts: PdfMeFont[] = savedFonts.flatMap((font) =>
    Object.entries(font.files).map(([key, value]) => ({
      fallback: false,
      label: `${font.family}-${key}`,
      data: value,
    }))
  );

  // Adds default PdfMe Roboto font as fallback.
  fonts.push({
    fallback: true,
    label: PdfMe.DEFAULT_FONT_NAME,
    data: PdfMe.getDefaultFont()[PdfMe.DEFAULT_FONT_NAME].data,
  });

  return fonts.reduce(
    (acc, font) => ({ ...acc, [font.label]: font }),
    {} as PdfMeTypes.Font
  );
}

export function getSavedFonts(): GoogleFont[] {
  const savedFontsRaw = localStorage.getItem(SAVED_FONTS_KEY);
  return savedFontsRaw ? JSON.parse(savedFontsRaw) : [];
}
