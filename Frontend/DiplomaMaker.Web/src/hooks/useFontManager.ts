import { FONT_MANAGER_ID, FontManager } from "@/components";

export function useFontManager() {
  const openManager = () =>
    (document.getElementById(FONT_MANAGER_ID) as HTMLDialogElement).showModal();

  return {
    openFontManager: openManager,
    FontManagerComponent: FontManager,
  };
}
