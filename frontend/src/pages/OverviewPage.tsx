import React, { useState } from 'react';
import './OverviewPage.css';
import { overviewPageItemsMockData } from '../Data/Mockdata';



export const OverviewPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const itemsPerPage = 8;
    const startIndex = (currentPage - 1) * itemsPerPage;

    const handlePrevPage = () => {
        setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
    };
    
    const items = overviewPageItemsMockData;
    const visibleItems = items.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const selectedItems = visibleItems.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(visibleItems.length / itemsPerPage);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    return (
        <main className="overview-page">
            <section className='overview-page__listmodule'>
                <div className='overview-page__listmodule-cardcontainer'>
                    {selectedItems.map((item, index) => (
                        <button key={index} className='listmodule__item'>
                            <p className='overview-page__item--title'>{item.title}</p>
                            <img className='overview-page__item--bg' src={item.src} alt={item.title} />
                        </button>
                    ))}
                </div>
                <footer className="overview-page__footer">
                    <button className="overview-page__pagination-button iconbtn" onClick={handlePrevPage}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 7L10 12L15 17" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <span className="overview-page__pagination-info">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button className="overview-page__pagination-button iconbtn" onClick={handleNextPage}>
                        <svg viewBox="0 0 24 24" style={{transform: 'rotate(180deg)'}} fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 7L10 12L15 17" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </footer>
            </section>
            <section className='overview-page__sidebar'>
                <div className='overview-page__sidebar-menu'>
                    <header className="overview-page__sidebar-menu-header">
                        <button>
                            Browse
                        </button>
                    </header>
                    <section className="overview-page__sidebar-menu-section">
                        <h3>Filtering</h3>
                        <div className="overview-page__header input-wrapper">
                            <input 
                                className="overview-page__search-input" 
                                type="text" 
                                placeholder="search" 
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            <svg className='input-icon' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </section>
                    <section className="overview-page__sidebar-menu-section">
                        <h3>Bootcamps</h3>
                        <div className="overview-page__select-container select-wrapper">
                            <select className="overview-page__select-box">
                                <option value=".Net Fullstack">Dotnet</option>
                                <option value="Java Fullstack">Java</option>
                                <option value="Javascript Fullstack">JavaScript</option>
                            </select>
                        </div>
                    </section>
                </div>
            </section>
        </main>
    );
};
