import React, { useEffect, useState } from 'react';
import './OverviewPage.css';
import { ModifyButton } from '../components/MenuItems/Buttons/ModifyButton';
import { RemoveButton } from '../components/MenuItems/Buttons/RemoveButton';
import { SelectOptions } from '../components/MenuItems/Inputs/SelectOptions';
import { SearchInput } from '../components/MenuItems/Inputs/SearchInput';
import { PaginationMenu } from '../components/MenuItems/PaginationMenu';
import { PublishButton } from '../components/MenuItems/Buttons/PublishButton';
import { BootcampResponse, DiplomaInBootcamp, DiplomaRequest, DiplomaResponse, DiplomaUpdateRequestDto } from '../util/types';
import { Popup404 } from '../components/MenuItems/Popups/Popup404';
import { SpinnerDefault } from '../components/MenuItems/Loaders/SpinnerDefault';
import { useNavigate } from 'react-router-dom';
import { generateCombinedPDF } from '../util/helper';
import { getTemplate, makeTemplateInput } from '../templates/baseTemplate';
import { AlertPopup, PopupType } from '../components/MenuItems/Popups/AlertPopup';
import { getTemplateBackup, makeTemplateInputBackup } from '../templates/baseTemplateBACKUP';
import { SaveButton } from '../components/MenuItems/Buttons/SaveButton';
import { SelectButton, SelectButtonType } from '../components/MenuItems/Buttons/SelectButton';
import { InfoPopupShort, InfoPopupType } from '../components/MenuItems/Popups/InfoPopupShort';
import { updateSingleDiploma } from '../services/diplomaService';

type Props = {
    bootcamps: BootcampResponse[] | null,
    deleteDiploma: (id: string) => Promise<void>;
    updateDiploma: (diplomaRequest: DiplomaUpdateRequestDto) => Promise<DiplomaResponse>;
}

export const OverviewPage = ({ bootcamps, deleteDiploma, updateDiploma }: Props) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBootcamp, setSelectedBootcamp] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [popupContent, setPopupContent] = useState<string[]>(["",""]);
    // @ts-ignore
    const [popupType, setPopupType] = useState<PopupType>(PopupType.fail);

    const [showConfirmationPopup, setShowConfirmationPopup] = useState<boolean>(false);
    const [confirmationPopupContent, setConfirmationPopupContent] = useState<string[]>(["",""]);
    const [confirmationPopupType, setConfirmationPopupType] = useState<InfoPopupType>(InfoPopupType.form);
    const [confirmationPopupHandler, setConfirmationPopupHandler] = useState<() => void>(() => {});

    useEffect(() => {
        if (bootcamps) {
            setLoading(false);
        }
        else{
            setLoading(true);
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
        
        setPopupType(PopupType.fail);
        setPopupContent(["Successfully deleted", "Diploma has been successfully deleted from the database."]);
        setShowPopup(true);
    };

    const generatePDFsHandler = async () => {
        const inputsArray = selectedItems.map(item => {
            const bootcamp = bootcamps?.find(b => b.diplomas.some(diploma => diploma.guidId === item.guidId));
            return bootcamp ? makeTemplateInput(
                bootcamp.template.intro,
                item.studentName,
                bootcamp.template.footer,
                bootcamp.template.basePdf
            ) : null;
        }).filter(input => input !== null) as ReturnType<typeof makeTemplateInput>[];

        const templates = inputsArray.map(input => getTemplate(input));

        await generateCombinedPDF(templates, inputsArray);
        setPopupContent(["PDFs Generated", "The combined PDF has been successfully generated."]);
        setPopupType(PopupType.success);
        setShowPopup(true);
    };

    const modifyStudentEmailHandler = async (studentInput?: DiplomaInBootcamp, originalEmail?: string) => {
        if(!studentInput?.emailAddress || studentInput?.emailAddress === "No Email"){
            alert("string is empty!")
            return;
        }
        if(!studentInput?.emailAddress.includes('@')){
            alert("Please put in a valid email address")
            return;
        }
        if(studentInput?.emailAddress == originalEmail){
            alert("email unchanged")
            return;
        }
        
        try {
            const emailUpdateRequest: DiplomaUpdateRequestDto = {
                guidId: studentInput.guidId,
                studentName: studentInput.studentName,
                emailAddress: studentInput.emailAddress
            }
            setShowConfirmationPopup(false);

            const emailUpdateResponse = await updateDiploma(emailUpdateRequest);
            
            setPopupContent(["Email Successfully Updated", `Email Successfully Updated for ${emailUpdateResponse.studentName}`]);
            setPopupType(PopupType.success);
            setShowPopup(true);

        } catch (error) {
            setPopupType(PopupType.fail);
            setPopupContent(["Something Went Wroing", `${error}`]);
            setShowPopup(true);
        }
       
        
    }

    const showStudentInfohandler = (student: DiplomaInBootcamp) => {
        if(student){
            var emailAddress = student.emailAddress;
            if(!student.emailAddress){
                emailAddress = "No Email"
            }
            customPopup(InfoPopupType.form, student.studentName, emailAddress, () => (inputContent?: DiplomaInBootcamp) => modifyStudentEmailHandler({
                guidId: student.guidId,
                studentName: student.studentName,
                emailAddress: inputContent
            }, emailAddress))
        }
    }

    const customPopup = (type: InfoPopupType, title: string, content: string, handler: () => ((inputContent?: string) => void) | (() => void)) => {
        setConfirmationPopupType(type);
        setConfirmationPopupContent([title, content]);
        setConfirmationPopupHandler(handler);
        setShowConfirmationPopup(true);
    }

    return (
        <main className="overview-page">
            <AlertPopup title={popupContent[0]} text={popupContent[1]} popupType={popupType} show={showPopup} onClose={() => setShowPopup(false)}/>
            <InfoPopupShort 
                title={confirmationPopupContent[0]}
                text={confirmationPopupContent[1]}
                show={showConfirmationPopup}
                infoPopupType={confirmationPopupType}
                abortClick={() => {setShowConfirmationPopup(false);}}
                // @ts-ignore
                confirmClick={(inputContent?: string) => confirmationPopupHandler(inputContent)}
            />
            <section className='overview-page__listmodule'>
            <div className='overview-page__listmodule-cardcontainer'>
                    {loading ? (
                        <SpinnerDefault classOverride="spinner"/>
                    ) : (
                        // @ts-ignore
                        selectedItems.length > 0 ? selectedItems.map((student: DiplomaInBootcamp, index) => (
                            <button key={student.guidId} className='listmodule__item'>
                                <p className='overview-page__item--title'>{student.studentName}</p>
                                <img className='overview-page__item--bg' src="https://res.cloudinary.com/dlw9fdrql/image/upload/v1718105458/diploma_xmqcfi.jpg" alt="" />
                                <section className='overview-page__item--menu'>
                                    <ModifyButton text='Modify' onClick={() => modifyHandler(student.guidId)} />
                                    <RemoveButton text='Remove' onClick={() => deleteHandler(student.guidId)} />
                                    <SelectButton classOverride="email-btn" selectButtonType={SelectButtonType.email} onClick={() => showStudentInfohandler(student)}/>
                                </section>
                            </button>
                        )) : 
                        <Popup404 text='No Diplomas Generated Yet For This Bootcamp'/>
                    )}
                </div>
                {selectedItems.length > 0 &&
                    <PaginationMenu
                        containerClassOverride='overview-page__footer'
                        buttonClassOverride='overview-page__pagination-button'
                        textContainerClassOverride='overview-page__pagination-info'
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handleNextPage={handleNextPage}
                        handlePrevPage={handlePrevPage}
                    />
                }
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
