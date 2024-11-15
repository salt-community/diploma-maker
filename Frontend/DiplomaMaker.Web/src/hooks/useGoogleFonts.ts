import { useQuery } from '@tanstack/react-query';
import { fetchGoogleFonts } from '../services/fontService';

export default function useGoogleFonts() {
  const {
    data: fonts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['google_fonts'],
    queryFn: fetchGoogleFonts,
    staleTime: Infinity,
  });

  return {
    fonts,
    isLoading,
    isError,
  };
}
