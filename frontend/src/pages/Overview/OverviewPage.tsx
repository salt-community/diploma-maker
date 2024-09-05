import React, { useEffect, useState } from 'react';
import './OverviewPage.css';
import { Student, StudentResponse, StudentUpdateRequestDto, EmailSendRequest, TemplateResponse, TrackResponse } from '../../util/types';
import { useNavigate } from 'react-router-dom';
import { AlertPopup } from '../../components/MenuItems/Popups/AlertPopup';
import { EmailClient } from '../../components/EmailClient/EmailClient';
import { useCustomAlert } from '../../components/Hooks/useCustomAlert';
import { useCustomInfoPopup } from '../../components/Hooks/useCustomInfoPopup';
import { InfoPopup } from '../../components/MenuItems/Popups/InfoPopup';
import { DiplomaCardContainer } from '../../components/Feature/Overview/DiplomaCardContainer';
import { defaultOverviewCardImage } from '../../data/data';
import { OverviewSideBar } from '../../components/Feature/Overview/OverviewSidebar';

type Props = {
    tracks: TrackResponse[] | null;
    deleteStudent: (id: string) => Promise<void>;
    updateStudentInformation: (studentRequest: StudentUpdateRequestDto) => Promise<StudentResponse>;
    sendEmail: (emailRequest: EmailSendRequest) => Promise<void>;
    templates: TemplateResponse[] | null;
    setLoadingMessage: (message: string) => void;
}

export const OverviewPage = ({ tracks, templates, deleteStudent, updateStudentInformation, sendEmail, setLoadingMessage  }: Props) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBootcamp, setSelectedBootcamp] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [showEmailClient, setShowEmailClient] = useState<boolean>(false);
    const [selectedTrack, setSelectedTrack] = useState<string | null>(null);

    const {showPopup, popupContent, popupType, customAlert, closeAlert } = useCustomAlert();
    const { showInfoPopup, infoPopupContent, infoPopupType, infoPopupHandler, customInfoPopup, closeInfoPopup, progress, setProgress } = useCustomInfoPopup();

    useEffect(() => {
        if (tracks) {
            setLoading(false);
        }
        else{
            setLoading(true);
        }
    }, [tracks]);
    
    const items = tracks?.flatMap(t => t.bootcamps.flatMap(b => b.students)) || [];
    
    const itemsPerPage = 8;
    const startIndex = (currentPage - 1) * itemsPerPage;

    let filteredBootcamps = [];

    filteredBootcamps = !selectedTrack
        ? tracks?.flatMap(t => t.bootcamps.map(b => ({ ...b, track: t })))
        : tracks[selectedTrack].bootcamps.map(b => ({ ...b, track: tracks[selectedTrack] })) || [];

    const sortedBootcamps = filteredBootcamps?.sort((a, b) => new Date(b.graduationDate).getTime() - new Date(a.graduationDate).getTime());

    const visibleItems = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!selectedBootcamp || 
            filteredBootcamps?.some(b => b.guidId === selectedBootcamp && b.students.includes(item)) // Filter by Bootcamp Selector
        ) &&
        (!selectedTrack || 
            filteredBootcamps?.some(bootcamp => bootcamp.students.includes(item)) // Filter by Track Selector
        )
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

    const modifyHandler = (guidId: string) => {
       if (tracks) {
            const bootcampIndex = tracks?.flatMap(t => t.bootcamps)?.findIndex(bootcamp =>
                bootcamp.students.some(student => student.guidId === guidId)
            );
            navigate(`/${bootcampIndex}`);
        } 
    };

    const modifyStudentEmailHandler = async (studentInput?: Student, originalEmail?: string) => {
        if(!studentInput?.email || studentInput?.email === "No Email"){
            customAlert('fail', "Validation Error", "Email field is empty!")
            closeInfoPopup();
            return;
        }
        if(!studentInput?.email.includes('@')){
            customAlert('fail', "Validation Error", "Please put in a valid email address")
            closeInfoPopup();
            return;
        }
        if(studentInput?.email == originalEmail){
            customAlert('message', "No changes", "Email was unchanged so no changes were made")
            closeInfoPopup();
            return;
        }
        
        customAlert('loading', `Changing ${studentInput.name}s email...`, ``);
        
        try {
            
            const emailUpdateRequest: StudentUpdateRequestDto = {
                guidId: studentInput.guidId,
                studentName: studentInput.name,
                emailAddress: studentInput.email
            }
            closeInfoPopup();
            await updateStudentInformation(emailUpdateRequest);
            customAlert('success', "Email Successfully Updated", `Email Successfully Updated for ${emailUpdateRequest.studentName}`)

        } catch (error) {
            customAlert('fail', "Something Went Wroing", `${error}`)
        }
    }

    const showStudentInfohandler = (student: Student) => {
        if(student){
            var emailAddress = student.email;
            if(!student.email){
                emailAddress = "No Email"
            }
            customInfoPopup('form', student.name, emailAddress, () => (inputContent?: Student) => modifyStudentEmailHandler({
                guidId: student.guidId,
                name: student.name,
                //@ts-ignore
                email: inputContent
            }, emailAddress))
        }
    }

    const showEmailClientHandler = () => {
        selectedBootcamp === null
            ? customAlert('message', 'Please select a bootcamp', 'Select a bootcamp from the dropdown menu') 
            : setShowEmailClient(true)
    }

    return (
        <main className="overview-page">
            <AlertPopup title={popupContent[0]} text={popupContent[1]} popupType={popupType} show={showPopup} onClose={closeAlert} />
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
            {selectedItems.length > 0 && tracks &&
                <EmailClient
                    title={selectedBootcamp ? tracks?.flatMap(t => t.bootcamps)?.find(bootcamp => bootcamp.guidId === selectedBootcamp)?.name : 'All Bootcamps'}
                    clients={visibleItems}
                    items={items}
                    templates={templates}
                    filteredBootcamps={filteredBootcamps}
                    closeEmailClient={() => { setShowEmailClient(false) }}
                    show={showEmailClient}
                    modifyStudentEmailHandler={modifyStudentEmailHandler}
                    sendEmail={sendEmail}
                    callCustomAlert={customAlert}
                    setProgress={setProgress}
                    customInfoPopup={customInfoPopup}
                />
            }
            <DiplomaCardContainer 
                visibleItems={visibleItems}
                selectedItems={selectedItems}
                currentPage={currentPage}
                totalPages={totalPages}
                handleNextPage={handleNextPage}
                handlePrevPage={handlePrevPage}
                defaultImg={defaultOverviewCardImage}
                loading={loading}
                startIndex={startIndex}
                itemsPerPage={itemsPerPage}
                modifyHandler={modifyHandler}
                deleteStudent={deleteStudent}
                showStudentInfohandler={showStudentInfohandler}
                customAlert={customAlert}
            />
            <OverviewSideBar 
                tracks={tracks}
                sortedBootcamps={sortedBootcamps}
                searchQuery={searchQuery}
                handleSearchChange={handleSearchChange}
                handleTrackChange={handleTrackChange}
                handleBootcampChange={handleBootcampChange}
                showEmailClientHandler={showEmailClientHandler}
            />
        </main>
    );
};
