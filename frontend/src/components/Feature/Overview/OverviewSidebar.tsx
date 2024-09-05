import { TrackResponse } from "../../../util/types";
import { SaveButton } from "../../MenuItems/Buttons/SaveButton";
import { EmailIcon } from "../../MenuItems/Icons/EmailIcon";
import { SearchInput } from "../../MenuItems/Inputs/SearchInput";
import { SelectOptions } from "../../MenuItems/Inputs/SelectOptions";

type Props = {
    tracks: TrackResponse[];
    sortedBootcamps: any[];
    searchQuery: string;
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleTrackChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleBootcampChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    showEmailClientHandler: () => void;
}

export const OverviewSideBar = ({ 
    tracks, 
    sortedBootcamps, 
    searchQuery, 
    handleSearchChange,
    handleTrackChange,
    handleBootcampChange,
    showEmailClientHandler
}: Props) => {
  return (
    <section className='overview-page__sidebar'>
        <div className='overview-page__sidebar-menu'>
            <header className="sidebar-menu__header">
                <button>
                    Browse
                </button>
            </header>
            <section className="sidebar-menu__section">
                <h3>Filtering</h3>
                <SearchInput
                    containerClassOverride='sidebar-menu__input-wrapper'
                    inputClassOverride='sidebar-menu__search-input'
                    searchQuery={searchQuery}
                    handleSearchChange={handleSearchChange}
                />
            </section>
            <section className='sidebar-menu__section'>
                <h3>Track</h3>
                {tracks && 
                    <SelectOptions
                        containerClassOverride='overview-page__select-container'
                        selectClassOverride='overview-page__select-box'
                        options={[
                            { value: "", label: "All Tracks" },
                            ...(tracks.map(track => ({
                                value: track.id.toString(),
                                label: track.name
                            })) || [])
                        ]}
                        onChange={handleTrackChange}
                    />
                }
            </section>
            <section className="sidebar-menu__section">
                <h3>Bootcamp</h3>
                <SelectOptions
                    containerClassOverride='sidebar-menu__select-container'
                    selectClassOverride='sidebar-menu__select-box'
                    options={[
                        { value: "", label: "All Bootcamps" },
                        ...(sortedBootcamps?.map(bootcamp => ({
                            value: bootcamp.guidId,
                            label: bootcamp.name
                        })) || [])
                    ]}
                    onChange={handleBootcampChange}
                />
            </section>
            <section className="sidebar-menu__section">
                <SaveButton textfield="Email Management" saveButtonType={'normal'} onClick={() => showEmailClientHandler()} customIcon={<EmailIcon />} />
            </section>
        </div>
    </section>
  );
};