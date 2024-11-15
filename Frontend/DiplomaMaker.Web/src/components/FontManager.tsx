import { GoogleFont } from '../services/fontService';
import { useState } from 'react';
import useDebounce from '../hooks/useDebounce';
import useGoogleFonts from '../hooks/useGoogleFonts';
import useUserFonts from '../hooks/useUserFonts';

export const FONT_MANAGER_ID = 'font_manager_modal';

type FontManagerProps = {
  onReloadFonts: () => void;
};

export default function FontManager({ onReloadFonts }: FontManagerProps) {
  return (
    <dialog
      id={FONT_MANAGER_ID}
      className="modal modal-bottom sm:modal-middle"
      onClose={onReloadFonts}
    >
      <div className="modal-box sm:max-w-screen-lg h-full pt-12">
        <form method="dialog">
          <button className="btn btn-lg btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div className="flex h-full gap-8">
          <UserFontsView />
          <AddFontView />
        </div>
      </div>
    </dialog>
  );
}

function UserFontsView() {
  const { fonts, removeFont } = useUserFonts();

  return (
    <section className="w-1/2 flex flex-col gap-4">
      <h2 className="font-bold text-xl mb-4">My Fonts</h2>
      <ul className="flex-1 overflow-y-scroll">
        {fonts.map((font, index) => (
          <ListItem
            key={index}
            text={font.family}
            onClick={() => removeFont(font)}
            mode="remove"
          />
        ))}
      </ul>
    </section>
  );
}

function AddFontView() {
  const { fonts, isLoading, isError } = useGoogleFonts();
  const { saveFont } = useUserFonts();

  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, 300);

  const filteredFonts = fonts
    ? fonts.filter((f) =>
        f.family.toLowerCase().includes(debouncedSearchText.toLowerCase())
      )
    : [];

  const handleSaveFont = (font: GoogleFont) => {
    saveFont(font);
  };

  return (
    <section className="w-1/2 flex flex-col gap-4">
      <h2 className="font-bold text-xl mb-4">Add new Font</h2>
      <label className="input input-bordered flex items-center gap-2">
        <input
          type="text"
          className="grow"
          placeholder="Search Google Font"
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
            <ListItem
              key={index}
              text={font.family}
              onClick={() => handleSaveFont(font)}
              mode="add"
            />
          ))}
        </ul>
      )}
      {isError && <p>Could not load fonts from Google.</p>}
      {isLoading && <p>Loading fonts...</p>}
    </section>
  );
}

type ListItemProps = {
  text: string;
  onClick: () => void;
  mode: 'add' | 'remove';
};

function ListItem({ text, onClick, mode }: ListItemProps) {
  return (
    <li>
      <button
        onClick={onClick}
        className="btn-ghost btn-block hover:bg-neutral group flex items-center justify-between p-3 transition-colors rounded-lg"
      >
        <span className="font-medium text-lg">{text}</span>
        <div
          className={`opacity-0 group-hover:opacity-100 btn btn-sm ${mode == 'add' ? 'btn-primary' : 'btn-error'}`}
        >
          {mode == 'add' ? '+ Add' : '- Remove'}
        </div>
      </button>
    </li>
  );
}
