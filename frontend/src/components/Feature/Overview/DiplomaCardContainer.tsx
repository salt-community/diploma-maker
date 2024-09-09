import { useState } from "react";
import { utcFormatter } from "../../../util/datesUtil";
import { Student, TrackResponse } from "../../../util/types";
import { LazyImageLoader } from "../../Content/LazyImageLoader";
import { ModifyButton } from "../../MenuItems/Buttons/ModifyButton";
import { RemoveButton } from "../../MenuItems/Buttons/RemoveButton";
import { SelectButton } from "../../MenuItems/Buttons/SelectButton";
import { VerifyIcon } from "../../MenuItems/Icons/VerifyIcon";
import { SpinnerDefault } from "../../MenuItems/Loaders/SpinnerDefault";
import { PaginationMenu } from "../../MenuItems/PaginationMenu";
import { Popup404 } from "../../MenuItems/Popups/Popup404";
import { PopupType } from "../../MenuItems/Popups/AlertPopup";
import { useNavigate } from "react-router-dom";
import { InfoPopupType } from "../../MenuItems/Popups/InfoPopup";

type Props = {
    tracks: TrackResponse[];
    selectedTrack: number | null;
    visibleItems: Student[];
    currentPage: number;
    totalPages: number;
    setCurrentPage: (value: React.SetStateAction<number>) => void;
    defaultImg: string;
    loading: boolean;
    startIndex: number;
    itemsPerPage: number;
    deleteStudent: (id: string) => Promise<void>;
    modifyStudentEmailHandler: (studentInput?: Student, originalEmail?: string) => Promise<void>;
    customAlert: (alertType: PopupType, title: string, content: string) => void;
    customInfoPopup: (type: InfoPopupType, title: string, content: string, handler: () => ((inputContent?: string) => void) | (() => void)) => void;
}

export const DiplomaCardContainer = ({ 
    tracks,
    selectedTrack,
    visibleItems, 
    currentPage, 
    totalPages,
    setCurrentPage,
    defaultImg,
    loading,
    startIndex,
    itemsPerPage,
    deleteStudent,
    customAlert,
    customInfoPopup,
    modifyStudentEmailHandler
}: Props) => {
    const [imageLoadedStates, setImageLoadedStates] = useState<boolean[]>(new Array(visibleItems.length).fill(false));
    const navigate = useNavigate();

    const api = import.meta.env.VITE_API_URL + "/api/Blob/";

    const handlePrevPage = () => {
        setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
    };
    
    const handleImageLoad = (index: number) => {
        setImageLoadedStates(prevStates => {
          const newStates = [...prevStates];
          newStates[index] = true;
          return newStates;
        });
      };

    const navigateToVerificationPage = (verificationCode: string) => {
        const url = `/verify/${verificationCode}`;
        window.open(url, '_blank');
    };

    const deleteStudentHandler = async (id: string) => {
        customAlert('loading', `Deleting Student...`, ``);
        try {
            await deleteStudent(id);
            customAlert('message', "Successfully deleted", "Diploma has been successfully deleted from the database.")
        } catch (error) {
            customAlert('fail', "Something went wrong.", `${error}`)
        }
    };

    const modifyStudentHandler = (guidId: string) => {
        const trackIndex = tracks.findIndex(track =>
            track.bootcamps.some(bootcamp => bootcamp.students.some(student => student.guidId === guidId))
        );
        const bootcampIndex = tracks[trackIndex].bootcamps.findIndex(bootcamp =>
            bootcamp.students.some(student => student.guidId === guidId)
        );

        navigate(`/pdf-creator?track=${trackIndex}&bootcamp=${bootcampIndex}`);
    };

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

    return (
        <section className='overview-page__list-module'>
            <div className='overview-page__list-module-card-container'>
                {loading ? (
                    <SpinnerDefault classOverride="spinner" />
                ) : (
                    visibleItems.length > 0 ? visibleItems.map((student: Student, index) => {
                        const isVisible = index >= startIndex && index < startIndex + itemsPerPage;
                        return (
                            <button key={student.guidId} className={`list-module__item ${isVisible ? 'visible' : 'hidden'}`}>
                                {!student.previewImageUrl && <p className='list-module__item-title'>{student.name}</p>}
                                <LazyImageLoader 
                                    previewImageLQIPUrl={student.previewImageLQIPUrl ? `${api}${student.previewImageLQIPUrl}` : defaultImg} 
                                    previewImageUrl={student.previewImageUrl ? `${api}${student.previewImageUrl}` : defaultImg} 
                                    loadTrigger={() => handleImageLoad(index)}
                                />
                                <section className='list-module__item-menu'>
                                    <ModifyButton text='Modify' onClick={() => modifyStudentHandler(student.guidId)} />
                                    <RemoveButton text='Remove' onClick={() => deleteStudentHandler(student.guidId)} />
                                    <SelectButton classOverride="email-btn" selectButtonType={'email'} onClick={() => showStudentInfohandler(student)} />
                                </section>
                                {student.lastGenerated && imageLoadedStates[index] && 
                                    <div onClick={() => navigateToVerificationPage(student.verificationCode)} className='list-module__item-menu--verifiedcontainer' data-student-lastgenerated={`last generated: ${utcFormatter(student.lastGenerated)}`}>
                                        <VerifyIcon />
                                    </div>
                                }
                            </button>
                        );
                    }) :
                    <Popup404 text='No Diplomas Generated Yet For This Bootcamp' />
                )}
            </div>
            {visibleItems.length > 0 &&
                <PaginationMenu
                    containerClassOverride='overview-page__footer'
                    buttonClassOverride='pagination-button'
                    textContainerClassOverride='pagination-info'
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handleNextPage={handleNextPage}
                    handlePrevPage={handlePrevPage}
                />
            }
        </section>
  );
};