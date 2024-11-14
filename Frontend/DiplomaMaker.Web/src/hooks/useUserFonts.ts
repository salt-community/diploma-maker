import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getSavedFonts,
  GoogleFont,
  removeFont,
  saveFont,
} from '../services/fontService';

const USER_FONTS_KEY = 'user_fonts';

export default function useUserFonts() {
  const client = useQueryClient();

  const userFontsQuery = useQuery({
    queryKey: [USER_FONTS_KEY],
    queryFn: getSavedFonts,
  });

  const saveFontMutation = useMutation({
    mutationFn: (font: GoogleFont) => saveFont(font),
    onSuccess: () => client.invalidateQueries({ queryKey: [USER_FONTS_KEY] }),
  });

  const removeFontMutation = useMutation({
    mutationFn: (font: GoogleFont) => removeFont(font),
    onSuccess: () => client.invalidateQueries({ queryKey: [USER_FONTS_KEY] }),
  });

  return {
    fonts: userFontsQuery.data ?? [],
    saveFont: (font: GoogleFont) => saveFontMutation.mutate(font),
    removeFont: (font: GoogleFont) => removeFontMutation.mutate(font),
  };
}
