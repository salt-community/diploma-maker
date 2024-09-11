import React, { useEffect, useRef, useState } from 'react';
import './OverviewPage.css';
import { Student, StudentResponse, StudentUpdateRequestDto, EmailSendRequest, TemplateResponse, TrackResponse } from '../../util/types';
import { AlertPopup } from '../../components/MenuItems/Popups/AlertPopup';
import { EmailClient } from '../../components/EmailClient/EmailClient';
import { useCustomAlert } from '../../components/Hooks/useCustomAlert';
import { useCustomInfoPopup } from '../../components/Hooks/useCustomInfoPopup';
import { InfoPopup } from '../../components/MenuItems/Popups/InfoPopup';
import { DiplomaCardContainer } from '../../components/Feature/Overview/DiplomaCardContainer';
import { defaultOverviewCardImage } from '../../data/data';
import { OverviewSideBar } from '../../components/Feature/Overview/OverviewSidebar';
import { validateEmail } from '../../util/validationUtil';

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
    const [showEmailClient, setShowEmailClient] = useState<boolean>(false);
    const [selectedTrack, setSelectedTrack] = useState<number | null>(0);

    const [isCancelled, setIsCancelled] = useState<boolean>(false);
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

    const itemsPerPage = 8;
    const startIndex = (currentPage - 1) * itemsPerPage;
    
    const allStudents: Student[] = tracks?.flatMap(t => t.bootcamps.flatMap(b => b.students)) || [];

    let filteredBootcamps = !selectedTrack
        ? tracks?.flatMap(t => t.bootcamps.map(b => ({ ...b, track: t })))
        : tracks[selectedTrack].bootcamps.map(b => ({ ...b, track: tracks[selectedTrack] })) || [];

    const sortedBootcamps = filteredBootcamps?.sort((a, b) => new Date(b.graduationDate).getTime() - new Date(a.graduationDate).getTime());

    const visibleStudents: Student[] = allStudents.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (!selectedBootcamp || 
                filteredBootcamps?.some(b => b.guidId === selectedBootcamp && b.students.includes(s)) // Filter by Bootcamp Selector
            ) &&
            (!selectedTrack || 
                filteredBootcamps?.some(bootcamp => bootcamp.students.includes(s)) // Filter by Track Selector
            )
    );
    
    const totalPages = Math.ceil(visibleStudents.length / itemsPerPage);

    const modifyStudentEmailHandler = async (studentInput?: Student, originalEmail?: string) => {
        if (!validateEmail(studentInput, originalEmail, customAlert, closeInfoPopup)) {
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

    const showEmailClientHandler = () => {
        selectedBootcamp === null
            ? customAlert('message', 'Please select a bootcamp', 'Select a bootcamp from the dropdown menu') 
            : setShowEmailClient(true)
    }

    const cancelHandler = () => {
        setIsCancelled(true);
        closeInfoPopup();
        customAlert('message', 'Operation Cancelled', 'The email sending process has been canceled.')
    };

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
                cancelHandler={cancelHandler}
            />
            {visibleStudents.length > 0 && tracks &&
                <EmailClient
                    title={selectedBootcamp ? tracks?.flatMap(t => t.bootcamps)?.find(bootcamp => bootcamp.guidId === selectedBootcamp)?.name : 'All Bootcamps'}
                    clients={visibleStudents}
                    items={allStudents}
                    templates={templates}
                    filteredBootcamps={filteredBootcamps}
                    closeEmailClient={() => { setShowEmailClient(false) }}
                    show={showEmailClient}
                    modifyStudentEmailHandler={modifyStudentEmailHandler}
                    callCustomAlert={customAlert}
                    setProgress={setProgress}
                    customInfoPopup={customInfoPopup}
                    isCancelled={isCancelled}
                    setIsCancelled={setIsCancelled}
                />
            }
            <DiplomaCardContainer 
                tracks={tracks}
                visibleItems={visibleStudents}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                defaultImg={defaultOverviewCardImage}
                loading={loading}
                startIndex={startIndex}
                itemsPerPage={itemsPerPage}
                deleteStudent={deleteStudent}
                modifyStudentEmailHandler={modifyStudentEmailHandler}
                customAlert={customAlert}
                customInfoPopup={customInfoPopup}
            />
            <OverviewSideBar 
                tracks={tracks}
                sortedBootcamps={sortedBootcamps}
                searchQuery={searchQuery}
                showEmailClientHandler={showEmailClientHandler}
                setCurrentPage={setCurrentPage}
                setSearchQuery={setSearchQuery}
                setSelectedTrack={setSelectedTrack}
                setSelectedBootcamp={setSelectedBootcamp}
            />
        </main>
    );
};
