export type TemplateSubstitutions = {
  text: Record<string, string>;
  images: Record<string, string>;
  qrCodes: Record<string, string>;
  basePdf: string;
};

export type TemplateImageSubstitutions = {
  basePdf: string;
  images: string[];
  qrCodes: string[];
};

export type TemplateInputs = Record<string, unknown>[];

export type MimeType = 'application/pdf' | 'image/webp' | 'application/json';

export type GoogleFont = {
  family: string;
  variants: Record<number, string>;
  files: Record<string, string>;
};

export type GoogleFontsResponse = {
  items: GoogleFont[];
};
