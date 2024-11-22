import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { FontService } from '@/services';
import type { FontTypes } from '@/services';

const USER_FONTS_KEY = 'user_fonts';

export function useUserFonts() {
  const client = useQueryClient();

  const userFontsQuery = useQuery({
    queryKey: [USER_FONTS_KEY],
    queryFn: FontService.getSavedFonts,
  });

  const saveFontMutation = useMutation({
    mutationFn: (font: FontTypes.GoogleFont) => FontService.saveFont(font),
    onSuccess: () => client.invalidateQueries({ queryKey: [USER_FONTS_KEY] }),
  });

  const removeFontMutation = useMutation({
    mutationFn: (font: FontTypes.GoogleFont) => FontService.removeFont(font),
    onSuccess: () => client.invalidateQueries({ queryKey: [USER_FONTS_KEY] }),
  });

  return {
    fonts: userFontsQuery.data ?? [],
    saveFont: (font: FontTypes.GoogleFont) => saveFontMutation.mutate(font),
    removeFont: (font: FontTypes.GoogleFont) => removeFontMutation.mutate(font),
  };
}
