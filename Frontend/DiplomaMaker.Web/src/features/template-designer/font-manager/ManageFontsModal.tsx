import { Modal } from "@/components";
import { useDebounce } from "@/hooks";
import { Delete02Icon, Download04Icon, Search01Icon } from "hugeicons-react";
import { useState } from "react";
import { useFonts } from "./useFonts";
import { useGoogleFonts } from "./useGoogleFonts";
import useRemoveFontMutation from "./useRemoveFontMutation";
import useSaveFontMutation from "./useSaveFontMutation";

export const MANAGE_FONTS_MODAL_ID = "manage-fonts-modal";

const tabs = ["Get Google Font", "My Fonts"];

type ManageFontsModalProps = {
  onReloadFonts: () => void;
};

// TODO: Show toast message when font is saved or removed
export default function ManageFontsModal({
  onReloadFonts,
}: ManageFontsModalProps) {
  const [selectedTab, setSelectedTab] = useState<string>(tabs[0]);

  return (
    <Modal id={MANAGE_FONTS_MODAL_ID} title="Fonts" onClose={onReloadFonts}>
      <div className="flex h-full flex-col gap-8 pt-4">
        <div role="tablist" className="tabs tabs-lifted">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              role="tab"
              className={`tab ${tab == selectedTab && "tab-active"}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex-1">
          {selectedTab === tabs[0] && <GoogleFontsTab />}
          {selectedTab === tabs[1] && <MyFontsTab />}
        </div>
      </div>
    </Modal>
  );
}

function GoogleFontsTab() {
  const { data: fonts, isLoading, isError } = useGoogleFonts();
  const { mutate: saveFont } = useSaveFontMutation();

  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 300);

  const filteredFonts = fonts
    ? fonts.filter((f) =>
        f.family.toLowerCase().includes(debouncedSearchText.toLowerCase()),
      )
    : [];

  return (
    <div className="flex h-full flex-col gap-6">
      <label className="input input-bordered flex items-center gap-2">
        <input
          type="text"
          className="grow"
          placeholder="Search Google Font"
          defaultValue={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Search01Icon size={16} />
      </label>
      <div className="flex-1">
        {filteredFonts.length ? (
          <ul>
            {filteredFonts.map((font, index) => (
              <li key={index} className="flex justify-between py-2">
                <span className="text-lg font-medium">{font.family}</span>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => saveFont(font)}
                >
                  <Download04Icon size={16} />
                  Get
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">
            Could not find any fonts with that name.
          </p>
        )}

        {isError && (
          <p className="text-center">Could not load fonts from Google.</p>
        )}
        {isLoading && <p className="text-center">Loading fonts...</p>}
      </div>
    </div>
  );
}

function MyFontsTab() {
  const { data: fonts } = useFonts();
  const { mutate: removeFont } = useRemoveFontMutation();

  return (
    <div className="flex h-full flex-col gap-6">
      {fonts?.length ? (
        <ul>
          {fonts.map((font, index) => (
            <li key={index} className="flex justify-between py-2">
              <span className="text-lg font-medium">{font.family}</span>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => removeFont(font)}
              >
                <Delete02Icon size={16} />
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">You don't have any fonts saved.</p>
      )}
    </div>
  );
}
