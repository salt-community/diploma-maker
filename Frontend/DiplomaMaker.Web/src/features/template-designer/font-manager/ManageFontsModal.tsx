import { useDebounce } from "@/hooks";
import { Delete02Icon, Download04Icon, Search01Icon } from "hugeicons-react";
import { useState } from "react";
import { useFonts } from "./useFonts";
import { useGoogleFonts } from "./useGoogleFonts";
import useRemoveFontMutation from "./useRemoveFontMutation";
import useSaveFontMutation from "./useSaveFontMutation";
import { BaseModalProps, Modal } from "@/components";

const tabs = ["Get Google Font", "My Fonts"];

// TODO: Show toast message when font is saved or removed
export default function ManageFontsModal({ isOpen, onClose }: BaseModalProps) {
  const [selectedTab, setSelectedTab] = useState<string>(tabs[0]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      panelClass="h-full flex flex-col gap-6"
    >
      <div className="">
        <h3 className="font-display text-lg font-bold">Save Template</h3>
        <button
          onClick={onClose}
          className="btn btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
      </div>
      <div role="tablist" className="tabs tabs-bordered">
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
      <div className="flex-1 overflow-y-auto">
        {selectedTab === tabs[0] && <GoogleFontsTab />}
        {selectedTab === tabs[1] && <MyFontsTab />}
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
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
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
    <div className="overflow-x-hidden">
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
