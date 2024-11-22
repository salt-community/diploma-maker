import { useQuery } from '@tanstack/react-query';

import { FontService } from '@/services';

export function useGoogleFonts() {
  const {
    data: fonts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['google_fonts'],
    queryFn: FontService.fetchGoogleFonts,
    staleTime: Infinity,
  });

  return {
    fonts,
    isLoading,
    isError,
  };
}
