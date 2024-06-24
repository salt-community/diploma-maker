import { NextIcon } from './Icons/NextIcon';
import './PaginationMenu.css'

type Props = {
    containerClassOverride?: string,
    buttonClassOverride?: string,
    textContainerClassOverride?: string,
    currentPage: number,
    totalPages: number,
    handlePrevPage: () => void,
    handleNextPage: () => void
};

export const PaginationMenu = ({ currentPage, totalPages, handlePrevPage, handleNextPage, containerClassOverride, buttonClassOverride, textContainerClassOverride }: Props) => {
    return (
        <footer className={"pagination-container " + containerClassOverride}>
            <button className={"iconbtn " + buttonClassOverride} onClick={handlePrevPage}>
                <NextIcon />
            </button>
            <span className={"pagination-info " + textContainerClassOverride}>
                Page {currentPage} of {totalPages}
            </span>
            <button className={"iconbtn " + buttonClassOverride} onClick={handleNextPage}>
                <NextIcon rotation={180}/>
            </button>
        </footer>
    );
};
