import React, { useState } from 'react';
import './OverviewPage.css';
import { overviewPageItemsMockData } from '../Data/Mockdata';
import { ModifyButton } from '../components/MenuItems/Buttons/ModifyButton';
import { RemoveButton } from '../components/MenuItems/Buttons/RemoveButton';
import { SelectOptions } from '../components/MenuItems/Inputs/SelectOptions';
import { SearchInput } from '../components/MenuItems/Inputs/SearchInput';
import { PaginationFooter } from '../components/MenuItems/PaginationFooter';

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
                                    <ModifyButton text='Modify'/>
                                    <RemoveButton text='Remove'/>
                            </section>
                        </button>
                    ))}
                </div>
                <PaginationFooter 
                    containerClassOverride='overview-page__footer'
                    buttonClassOverride='overview-page__pagination-button'
                    textContainerClassOverride='overview-page__pagination-info'
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handleNextPage={handleNextPage}
                    handlePrevPage={handlePrevPage}
                />
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
                        <SearchInput 
                            containerClassOverride='overview-page__header input-wrapper'
                            inputClassOverride='overview-page__search-input'
                            searchQuery={searchQuery}
                            handleSearchChange={handleSearchChange}
                        />
                    </section>
                    <section className="overview-page__sidebar-menu-section">
                        <h3>Bootcamps</h3>
                        <SelectOptions 
                            containerClassOverride='overview-page__select-container'
                            selectClassOverride='overview-page__select-box'
                            options={
                                [
                                    { value: '.Net Fullstack', label: '.Net Fullstack 2023' },
                                    { value: 'Java Fullstack', label: 'Java Fullstack 2024' },
                                    { value: 'Javascript Fullstack', label: 'Javascript Fullstack 2024' }
                                ]
                            }
                        />
                    </section>
                </div>
            </section>
        </main>
    );
};
