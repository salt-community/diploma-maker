import { TrackResponse } from "../../../util/types";
import { SaveButton } from "../../MenuItems/Buttons/SaveButton";
import { EmailIcon } from "../../MenuItems/Icons/EmailIcon";
import { SearchInput } from "../../MenuItems/Inputs/SearchInput";
import { SelectOptions } from "../../MenuItems/Inputs/SelectOptions";

type Props = {
    tracks: TrackResponse[];
    sortedBootcamps: any[];
    searchQuery: string;
    showEmailClientHandler: () => void;
    setCurrentPage: (value: React.SetStateAction<number>) => void
    setSearchQuery: (value: React.SetStateAction<string>) => void;
    setSelectedTrack: (value: React.SetStateAction<string>) => void;
    setSelectedBootcamp: (value: React.SetStateAction<string>) => void;
}

export const OverviewSideBar = ({ 
    tracks, 
    sortedBootcamps, 
    searchQuery, 
    showEmailClientHandler,
    setCurrentPage,
    setSearchQuery,
    setSelectedTrack,
    setSelectedBootcamp
}: Props) => {

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleBootcampChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.target.selectedIndex === 0 ?
        setSelectedBootcamp(null) : 
        setSelectedBootcamp(e.target.value);
        setCurrentPage(1);
    };

    const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.target.value === "" ? setSelectedTrack(null) : setSelectedTrack((parseInt(e.target.value) - 1).toString());
        setSelectedBootcamp(null);
        setCurrentPage(1);
    };

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