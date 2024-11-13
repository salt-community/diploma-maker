import { useQuery } from '@tanstack/react-query';
import { fetchGoogleFonts, saveFont } from '../services/fontService';
import { GoogleFont } from '../types/types';

export const FONT_MANAGER_ID = 'font_manager_modal';

export default function FontManager({
  onReloadFonts,
}: {
  onReloadFonts: () => void;
}) {
  const {
    data: fonts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['google_fonts'],
    queryFn: fetchGoogleFonts,
  });

  const handleSaveFont = (font: GoogleFont) => {
    saveFont(font);
    onReloadFonts();
    alert("Font saved!");
  }

  return (
    <dialog id={FONT_MANAGER_ID} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Manage fonts</h3>
        {isError && <p>Could not load fonts from Google.</p>}
        {isLoading && <p>Loading fonts...</p>}
        {fonts && (
          <ul>
            {fonts.map((font, index) => (
              <li key={index} onClick={() => handleSaveFont(font)}>
                {font.family}
              </li>
            ))}
          </ul>
        )}
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
