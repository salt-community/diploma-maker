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
                            <section className='overview-page__item--menu'>
                                    <button className="btn remove-btn">
                                        <span className="btn-title">Remove</span>
                                        <svg className="btn-close-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                                        </svg>
                                    </button>
                                    <button className="btn modify-btn">
                                        <span className="btn-title">Modify</span>
                                        <svg className="btn-close-icon" version="1.1" id="Uploaded to svgrepo.com" height="24px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" >
                                            <path d="M27.5,14h-2.731c-0.228-1.003-0.624-1.94-1.156-2.785l1.933-1.933c0.195-0.195,0.195-0.512,0-0.707
                                                l-2.121-2.121c-0.195-0.195-0.512-0.195-0.707,0l-1.933,1.933C19.94,7.855,19.003,7.459,18,7.231V4.5C18,4.224,17.776,4,17.5,4h-3
                                                C14.224,4,14,4.224,14,4.5v2.731c-1.003,0.228-1.94,0.624-2.785,1.156L9.282,6.454c-0.195-0.195-0.512-0.195-0.707,0L6.454,8.575
                                                c-0.195,0.195-0.195,0.512,0,0.707l1.933,1.933C7.855,12.06,7.459,12.997,7.231,14H4.5C4.224,14,4,14.224,4,14.5v3
                                                C4,17.776,4.224,18,4.5,18h2.731c0.228,1.003,0.624,1.94,1.156,2.785l-1.933,1.933c-0.195,0.195-0.195,0.512,0,0.707l2.121,2.121
                                                c0.195,0.195,0.512,0.195,0.707,0l1.933-1.933c0.845,0.532,1.782,0.928,2.785,1.156V27.5c0,0.276,0.224,0.5,0.5,0.5h3
                                                c0.276,0,0.5-0.224,0.5-0.5v-2.731c1.003-0.228,1.94-0.624,2.785-1.156l1.933,1.933c0.195,0.195,0.512,0.195,0.707,0l2.121-2.121
                                                c0.195-0.195,0.195-0.512,0-0.707l-1.933-1.933c0.532-0.845,0.928-1.782,1.156-2.785H27.5c0.276,0,0.5-0.224,0.5-0.5v-3
                                                C28,14.224,27.776,14,27.5,14z M16,21c-2.761,0-5-2.239-5-5s2.239-5,5-5s5,2.239,5,5S18.761,21,16,21z"
                                            />
                                        </svg>
                                    </button>
                            </section>
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
