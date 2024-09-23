import { SearchIcon } from '../Icons/SearchIcon';
import './SearchInput.css'

type Props = {
    containerClassOverride: string,
    inputClassOverride: string,
    searchQuery: string,
    handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void
};

export const SearchInput = ({ searchQuery, handleSearchChange, containerClassOverride, inputClassOverride }: Props) => {
    return (
        <div className={"input-wrapper " + containerClassOverride}>
            <input 
                className={inputClassOverride}
                type="text" 
                placeholder="search" 
                value={searchQuery}
                onChange={handleSearchChange}
            />
            <SearchIcon />
        </div>
    );
};
