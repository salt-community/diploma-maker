import React, { useEffect, useState } from 'react';
import './OverviewPage.css';
import { ModifyButton } from '../components/MenuItems/Buttons/ModifyButton';
import { RemoveButton } from '../components/MenuItems/Buttons/RemoveButton';
import { SelectOptions } from '../components/MenuItems/Inputs/SelectOptions';
import { SearchInput } from '../components/MenuItems/Inputs/SearchInput';
import { PaginationMenu } from '../components/MenuItems/PaginationMenu';
import { PublishButton } from '../components/MenuItems/Buttons/PublishButton';
import { BootcampResponse, DiplomaInBootcamp, DiplomaResponse, DiplomaUpdateRequestDto, EmailSendRequest } from '../util/types';
import { Popup404 } from '../components/MenuItems/Popups/Popup404';
import { SpinnerDefault } from '../components/MenuItems/Loaders/SpinnerDefault';
import { useNavigate } from 'react-router-dom';
import { delay, generatePDF, oldGenerateCombinedPDF, populateField } from '../util/helper';
import { getTemplate, makeTemplateInput } from '../templates/baseTemplate';
import { AlertPopup, PopupType } from '../components/MenuItems/Popups/AlertPopup';
import { SaveButton, SaveButtonType } from '../components/MenuItems/Buttons/SaveButton';
import { SelectButton, SelectButtonType } from '../components/MenuItems/Buttons/SelectButton';
import { InfoPopup, InfoPopupType } from '../components/MenuItems/Popups/InfoPopup';
import { EmailClient } from '../components/EmailClient';
import { EmailIcon } from '../components/MenuItems/Icons/EmailIcon';
import { mapTemplateInputsBootcampsToTemplateViewer } from '../util/dataHelpers';
import { useCustomAlert } from '../components/Hooks/useCustomAlert';
import { useCustomInfoPopup } from '../components/Hooks/useCustomInfoPopup';

type Props = {
    bootcamps: BootcampResponse[] | null,
    deleteDiploma: (id: string) => Promise<void>;
    updateDiploma: (diplomaRequest: DiplomaUpdateRequestDto) => Promise<DiplomaResponse>;
    sendEmail: (emailRequest: EmailSendRequest) => Promise<void>;
}

export const OverviewPage = ({ bootcamps, deleteDiploma, updateDiploma, sendEmail }: Props) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBootcamp, setSelectedBootcamp] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [showEmailClient, setShowEmailClient] = useState<boolean>(false);

    const { showPopup, popupContent, popupType, customAlert, closeAlert } = useCustomAlert();
    const { showInfoPopup, infoPopupContent, infoPopupType, infoPopupHandler, customInfoPopup, closeInfoPopup, progress, setProgress } = useCustomInfoPopup();

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

    const deleteHandler = async (id: string) => {
        await deleteDiploma(id);
        customAlert(PopupType.fail, "Successfully deleted", "Diploma has been successfully deleted from the database.")
    };

    const generatePDFsHandler = async () => {
        const inputsArray = selectedItems.map(item => {
            const bootcamp = bootcamps?.find(b => b.diplomas.some(diploma => diploma.guidId === item.guidId));
            return bootcamp ? makeTemplateInput(
                populateField(bootcamp.template.intro, bootcamp.name, bootcamp.graduationDate.toString().slice(0, 10), item.studentName),
                populateField(item.studentName, bootcamp.name, bootcamp.graduationDate.toString().slice(0, 10), item.studentName),
                populateField(bootcamp.template.footer, bootcamp.name, bootcamp.graduationDate.toString().slice(0, 10), item.studentName),
                bootcamp.template.basePdf
            ) : null;
        }).filter(input => input !== null) as ReturnType<typeof makeTemplateInput>[];

        const templates = inputsArray.map(input => getTemplate(input));

        await oldGenerateCombinedPDF(templates, inputsArray);
        customAlert(PopupType.success, "PDFs Generated", "The combined PDF has been successfully generated.")
    };

    const modifyStudentEmailHandler = async (studentInput?: DiplomaInBootcamp, originalEmail?: string) => {
        if(!studentInput?.emailAddress || studentInput?.emailAddress === "No Email"){
            customAlert(PopupType.fail, "Validation Error", "Email field is empty!")
            closeInfoPopup();
            return;
        }
        if(!studentInput?.emailAddress.includes('@')){
            customAlert(PopupType.fail, "Validation Error", "Please put in a valid email address")
            closeInfoPopup();
            return;
        }
        if(studentInput?.emailAddress == originalEmail){
            customAlert(PopupType.message, "No changes", "Email was unchanged so no changes were made")
            closeInfoPopup();
            return;
        }
        
        try {
            
            const emailUpdateRequest: DiplomaUpdateRequestDto = {
                guidId: studentInput.guidId,
                studentName: studentInput.studentName,
                emailAddress: studentInput.emailAddress
            }
            closeInfoPopup();
            const emailUpdateResponse = await updateDiploma(emailUpdateRequest);
            customAlert(PopupType.success, "Email Successfully Updated", `Email Successfully Updated for ${emailUpdateResponse.studentName}`)

        } catch (error) {
            customAlert(PopupType.fail, "Something Went Wroing", `${error}`)
        }
    }

    const showStudentInfohandler = (student: DiplomaInBootcamp) => {
        if(student){
            var emailAddress = student.emailAddress;
            if(!student.emailAddress){
                emailAddress = "No Email"
            }
            customInfoPopup(InfoPopupType.form, student.studentName, emailAddress, () => (inputContent?: DiplomaInBootcamp) => modifyStudentEmailHandler({
                guidId: student.guidId,
                studentName: student.studentName,
                emailAddress: inputContent
            }, emailAddress))
        }
    }

    const sendEmailsHandler = async (userIds: string[]) => {
        if(userIds.length === 0) return
        
        customInfoPopup(InfoPopupType.progress, "Just a minute...", "Mails are journeying through the ether as we speak. Hold tight, your patience is a quiet grace.", () => {});
        const blendProgressDelay = 750;

        for (let i = 0; i < userIds.length; i++) {
            try {
                var file = await generatePDFFile(userIds[i]);
                var emailSendRequest: EmailSendRequest = {
                    guidId: userIds[i],
                    file: file
                }
                await sendEmail(emailSendRequest)
            } catch (error) {
                customInfoPopup(InfoPopupType.fail, `Opps, Something went wrong`, `${error}`, () => {});
                return;
            }
           
            const progressBarValue = ((i + 1) / userIds.length) * 100;
            await blendProgress((i / userIds.length) * 100, progressBarValue, blendProgressDelay);
        }
    }

    const generatePDFFile = async (guidId: string): Promise<Blob | void> => {
        const diploma = items.find(item => item.guidId === guidId);
        if (!diploma) {
            customAlert(PopupType.fail, "Selection Error:", "No Emails Selected");
            return;
        }
        const bootcamp = bootcamps?.find(b => b.diplomas.some(d => d.guidId === guidId));
        if (!bootcamp) {
            customAlert(PopupType.fail, "Bootcamp Error:", "Bootcamp not found");
            return;
        }
    
        const pdfInput = makeTemplateInput(
            populateField(bootcamp.template.intro, bootcamp.name, bootcamp.graduationDate.toString().slice(0, 10), diploma.studentName),
            populateField(diploma.studentName, bootcamp.name, bootcamp.graduationDate.toString().slice(0, 10), diploma.studentName),
            populateField(bootcamp.template.footer, bootcamp.name, bootcamp.graduationDate.toString().slice(0, 10), diploma.studentName),
            bootcamp.template.basePdf
        );

        const template = mapTemplateInputsBootcampsToTemplateViewer(bootcamp, pdfInput);
        const pdfFile = await generatePDF(template, [pdfInput], true);
        return pdfFile;
    };

    const blendProgress = async (start: number, end: number, blendDelay: number) => {
        const steps = Math.abs(end - start);
        const stepDelay = blendDelay / steps;
        for (let i = 1; i <= steps; i++) {
            await delay(stepDelay);
            setProgress(Math.round(start + i * Math.sign(end - start)));
        }
    }

    return (
        <main className="overview-page">
            <AlertPopup title={popupContent[0]} text={popupContent[1]} popupType={popupType} show={showPopup} onClose={closeAlert}/>
            <InfoPopup 
                title={infoPopupContent[0]}
                text={infoPopupContent[1]}
                show={showInfoPopup}
                infoPopupType={infoPopupType}
                abortClick={closeInfoPopup}
                // @ts-ignore
                confirmClick={(inputContent?: string) => infoPopupHandler(inputContent)}
                currentProgress={progress}
                setCurrentProgress={setProgress}
            />
            {selectedItems.length > 0 && 
                <EmailClient 
                    title={selectedBootcamp ? bootcamps?.find(bootcamp => bootcamp.guidId === selectedBootcamp)?.name : 'All Bootcamps'} 
                    clients={selectedItems}
                    closeEmailClient={() => {setShowEmailClient(false)}}
                    show={showEmailClient}
                    modifyStudentEmailHandler={modifyStudentEmailHandler} 
                    sendEmails={(userIds: string[]) => {sendEmailsHandler(userIds)}}
                    callCustomAlert={customAlert}
                />
            }
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
                    <section className="overview-page__sidebar-menu-section">
                        <SaveButton textfield="Email Management" saveButtonType={SaveButtonType.normal} onClick={() => setShowEmailClient(true)} customIcon={<EmailIcon />}/>
                    </section>
                </div>
            </section>
        </main>
    );
};
