import FontManager, { FONT_MANAGER_ID } from '../components/FontManager';

export function useFontManager() {
  const openManager = () =>
    (document.getElementById(FONT_MANAGER_ID) as HTMLDialogElement).showModal();

  return {
    openFontManager: openManager,
    FontManagerComponent: FontManager,
  };
}
