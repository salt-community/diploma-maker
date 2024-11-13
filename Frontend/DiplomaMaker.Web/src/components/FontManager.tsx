import { useQuery } from '@tanstack/react-query';
import { fetchGoogleFonts, saveFont } from '../services/fontService';
import { GoogleFont } from '../types/types';
import { useState } from 'react';

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

  const [searchText, setSearchText] = useState('');

  const filteredFonts = fonts
    ? fonts.filter((f) => f.family.includes(searchText))
    : [];

  const handleSaveFont = (font: GoogleFont) => {
    saveFont(font);
    onReloadFonts();
    alert('Font added!');
  };

  return (
    <dialog id={FONT_MANAGER_ID} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box h-full max-h-[600px]">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl mb-4">Manage Fonts</h3>
        <div className="flex flex-col gap-4 h-full">
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="text"
              className="grow"
              placeholder="Search Google Fonts"
              defaultValue={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
          {fonts && (
            <ul className="flex-1 overflow-y-scroll">
              {filteredFonts.map((font, index) => (
                <li
                  className="group flex items-center justify-between py-2 hover:text-white cursor-pointer transition-colors"
                  key={index}
                  onClick={() => handleSaveFont(font)}
                >
                  <span>{font.family}</span>
                  <button className="opacity-0 group-hover:opacity-100 btn btn-xs btn-primary">
                    + Add
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {isError && <p>Could not load fonts from Google.</p>}
        {isLoading && <p>Loading fonts...</p>}
      </div>
    </dialog>
  );
}
