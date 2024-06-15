import React, { useEffect, useState } from 'react';
import './OverviewPage.css';
import { ModifyButton } from '../components/MenuItems/Buttons/ModifyButton';
import { RemoveButton } from '../components/MenuItems/Buttons/RemoveButton';
import { SelectOptions } from '../components/MenuItems/Inputs/SelectOptions';
import { SearchInput } from '../components/MenuItems/Inputs/SearchInput';
import { PaginationMenu } from '../components/MenuItems/PaginationMenu';
import { PublishButton } from '../components/MenuItems/Buttons/PublishButton';
import { BootcampResponse, DiplomaInBootcamp } from '../util/types';
import { Popup404 } from '../components/MenuItems/Popups/Popup404';
import { SpinnerDefault } from '../components/MenuItems/Loaders/SpinnerDefault';
import { useNavigate } from 'react-router-dom';
import { generateCombinedPDF } from '../util/helper';
import { getTemplate, makeTemplateInput } from '../templates/baseTemplate';

type Props = {
    bootcamps: BootcampResponse[] | null,
    deleteDiploma: (id: string) => Promise<void>;
}

export const OverviewPage = ({ bootcamps, deleteDiploma }: Props) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBootcamp, setSelectedBootcamp] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (bootcamps) {
            setLoading(false);
        }
    }, [bootcamps]);

    const items = bootcamps?.flatMap(bootcamp => bootcamp.diplomas) || []; // Flatmap instead of map to flatten [][] into []
    const itemsPerPage = 8;
    const startIndex = (currentPage - 1) * itemsPerPage;

    const visibleItems = items.filter((item: DiplomaInBootcamp) =>
        item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!selectedBootcamp || bootcamps?.some(bootcamp => bootcamp.guidId === selectedBootcamp && bootcamp.diplomas.includes(item)))
    );

    const selectedItems = visibleItems.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(visibleItems.length / itemsPerPage);

    const handlePrevPage = () => {
        setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleBootcampChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBootcamp(e.target.value);
        setCurrentPage(1);
    };

    const modifyHandler = (guidId: string) => {
       if (bootcamps) {
            const bootcampIndex = bootcamps.findIndex(bootcamp =>
                bootcamp.diplomas.some(diploma => diploma.guidId === guidId)
            );
            navigate(`/${bootcampIndex}`);
        } 
    };

    const deleteHandler = (id: string) => {
        setLoading(true);
        deleteDiploma(id);
        setLoading(false);
    };

    const generatePDFsHandler = async () => {
        const inputsArray = selectedItems.map(item => {
            const bootcamp = bootcamps?.find(b => b.diplomas.some(diploma => diploma.guidId === item.guidId));
            return bootcamp ? [makeTemplateInput(item.studentName, bootcamp.name, bootcamp.graduationDate.toString().slice(0, 10))] : [];
        });
    
        await generateCombinedPDF(selectedItems.map(() => getTemplate()), inputsArray);
    };

    return (
        <main className="overview-page">
            <section className='overview-page__listmodule'>
            <div className='overview-page__listmodule-cardcontainer'>
                    {loading ? (
                        <SpinnerDefault classOverride="spinner"/>
                    ) : (
                        selectedItems.length > 0 ? selectedItems.map((item, index) => (
                            <button key={item.guidId} className='listmodule__item'>
                                <p className='overview-page__item--title'>{item.studentName}</p>
                                <img className='overview-page__item--bg' src="https://res.cloudinary.com/dlw9fdrql/image/upload/v1718105458/diploma_xmqcfi.jpg" alt="" />
                                <section className='overview-page__item--menu'>
                                    <ModifyButton text='Modify' onClick={() => modifyHandler(item.guidId)} />
                                    <RemoveButton text='Remove' onClick={() => deleteHandler(item.guidId)} />
                                </section>
                            </button>
                        )) : 
                        <Popup404 text='No Diplomas Generated Yet For This Bootcamp'/>
                    )}
                </div>
                <PaginationMenu
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
                            options={[
                                { value: "", label: "All Bootcamps" },
                                ...(bootcamps?.map(bootcamp => ({
                                    value: bootcamp.guidId,
                                    label: bootcamp.name
                                })) || [])
                            ]}
                            onChange={handleBootcampChange}
                        />
                    </section>
                    <section className="overview-page__sidebar-menu-section">
                        <h3>Generate</h3>
                        <PublishButton text='Generate PDFs' onClick={generatePDFsHandler} />
                    </section>
                </div>
            </section>
        </main>
    );
};
