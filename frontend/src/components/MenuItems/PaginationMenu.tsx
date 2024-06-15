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
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 7L10 12L15 17" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
            <span className={"pagination-info " + textContainerClassOverride}>
                Page {currentPage} of {totalPages}
            </span>
            <button className={"iconbtn " + buttonClassOverride} onClick={handleNextPage}>
                <svg viewBox="0 0 24 24" style={{ transform: 'rotate(180deg)' }} fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 7L10 12L15 17" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
        </footer>
    );
};
