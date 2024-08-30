import React, { useEffect, useRef, useState } from "react";
import { EmailConfigRequestDto, Student } from "../../util/types";
import './EmailClient.css';
import { CloseWindowIcon } from "../MenuItems/Icons/CloseWindowIcon";
import { CogWheelIcon } from "../MenuItems/Icons/CogWheelIcon";
import { SaveButton, SaveButtonType } from "../MenuItems/Buttons/SaveButton";
import { AlertPopup, PopupType } from "../MenuItems/Popups/AlertPopup";
import CustomCheckBoxRound from "../MenuItems/Inputs/CustomCheckBoxRound";
import { ModifyButton } from "../MenuItems/Buttons/ModifyButton";
import { ConfigureIcon } from "../MenuItems/Icons/ConfigureIcon";
import { CloseIcon } from "../MenuItems/Icons/CloseIcon";
import { EmailIcon } from "../MenuItems/Icons/EmailIcon";
import { VerifyIcon } from "../MenuItems/Icons/VerifyIcon";
import { AddButton } from "../MenuItems/Buttons/AddButton";
import { AddIcon } from "../MenuItems/Icons/AddIcon";
import { SuccessIcon } from "../MenuItems/Icons/SuccessIcon";
import { PasswordIcon } from "../MenuItems/Icons/PasswordIcon";
import { useCustomAlert } from "../Hooks/useCustomAlert";
import { EyeIcon } from "../MenuItems/Icons/EyeIcon";
import { MountainIcon } from "../MenuItems/Icons/MountainIcon";
import { HelpIcon } from "../MenuItems/Icons/HelpIcon";
import { InstructionSlideshow } from "../Content/InstructionSlideshow";
import { EmailConfigInstructionSlides } from "../../data/data";
import { DescriptionIcon } from "../MenuItems/Icons/DescriptionIcon";
import { TitleIcon } from "../MenuItems/Icons/TitleIcon";
import { CloudUploadIcon } from "../MenuItems/Icons/CloudUploadIcon";
import { ArrowIcon } from "../MenuItems/Icons/ArrowIcon";
import { NextIcon } from "../MenuItems/Icons/NextIcon";
import { EmailContentConfigSection } from "./EmailContentConfigSection";
import { EmailHostConfigSection } from "./EmailHostConfigSection";
import { EmailSendSection } from "./EmailSendSection";

type Props = {
    clients: Student[],
    title: string | undefined,
    show: boolean,
    closeEmailClient: () => void,
    modifyStudentEmailHandler: (studentInput?: Student, originalEmail?: string) => void,
    sendEmails: (userIds: string[], title: string, description: string) => void,
    callCustomAlert: (alertType: PopupType, title: string, content: string) => void,
};

export const EmailClient = ({ clients, title, show, closeEmailClient, modifyStudentEmailHandler, sendEmails, callCustomAlert }: Props) => {
    const [emailChanges, setEmailChanges] = useState<{[key: string]: string}>({});
    const [checkedUsers, setCheckedUsers] = useState<{[key: string]: boolean}>({});
    const [emailEditContentActive, setEmailEditContentActive] = useState<boolean>(false);
    const emailTitleInput = useRef(null);
    const emailDescriptionInput = useRef(null)
    
    const [emailTitle, setEmailTitle] = useState<string>('');
    const [emailDescription, setEmailDescription] = useState<string>('');

    const {showPopup, popupContent, popupType, customAlert, closeAlert } = useCustomAlert();

    useEffect(() => {
        const storedEmailTitle = localStorage.getItem('emailcontent_title');
        const storedEmailDescription = localStorage.getItem('emailcontent_description');
        setEmailTitle(storedEmailTitle ? JSON.parse(storedEmailTitle) : `<h1>Congratulations, {studentName}! 🎉</h1>`);
        setEmailDescription(storedEmailDescription ? JSON.parse(storedEmailDescription) : `<p>We are thrilled to award you the Salt Diploma. Your hard work and dedication have paid off, and we are excited to see what you accomplish next.</p> <p>Keep striving for greatness, and remember that this is just the beginning of your journey. Well done on completing the bootcamp!</p>`);
    }, []);

    // To Prevent Sending to students that are not visible in dom
    useEffect(() => {
        if (show) {
            setCheckedUsers({});
        }
    }, [show]);

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, student: Student) => {
        const value = event.target.value;
        
        setEmailChanges((prevState) => ({
            ...prevState,
            [student.guidId!]: value,
        }));
    };

    const inputBlurHandler = (student: Student) => {
        const newEmail = emailChanges[student.guidId];
        if (newEmail && newEmail !== student.email) {
            modifyStudentEmailHandler({
                ...student,
                email: newEmail,
            }, student.email);
        }
    };

    const checkboxChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, studentId: string) => {
        setCheckedUsers({
            ...checkedUsers,
            [studentId]: event.target.checked,
        });
    };

    const sendEmailsHandler = () => {
        const selectedIds = Object.keys(checkedUsers).filter(id => checkedUsers[id]);
        const selectedStudents = clients.filter(student => selectedIds.includes(student.guidId));
        const studentNullEmail = selectedStudents.find(student => !student.email);

        if (studentNullEmail) {
            callCustomAlert('fail', `Failure in sending emails`, `Cannot send email to ${studentNullEmail.name} as their email address is missing.`);
            return;
        }
        sendEmails(selectedIds, emailTitle, emailDescription);
    }

    const emailContentSaveHandler = () => {
        localStorage.setItem('emailcontent_title', JSON.stringify(emailTitle));
        localStorage.setItem('emailcontent_description', JSON.stringify(emailDescription));
        customAlert('success',"Successfully Saved Email Content",``);
    }

    const handleEmailTitleChange = (event) => {
        setEmailTitle(event.target.value);
    }

    const handleEmailDescriptionChange = (event) => {
        setEmailDescription(event.target.value);
    }


    return (
        <>
            <section className={"emailclient " + (show ? 'fade-in' : 'fade-out')}>
                <header className="emailclient__header">
                    <h1>{title}</h1>
                    <h2>Students</h2>
                </header>
                {emailEditContentActive ?
                    <>
                        <ul className="emailclient__list">
                            {emailEditContentActive ? 
                                <EmailContentConfigSection
                                    emailTitle={emailTitle}
                                    emailDescription={emailDescription}
                                    emailTitleInput={emailTitleInput}
                                    emailDescriptionInput={emailDescriptionInput}
                                    handleEmailTitleChange={handleEmailTitleChange}
                                    handleEmailDescriptionChange={handleEmailDescriptionChange}
                                />
                                :
                                <EmailContentConfigSection
                                    emailTitle={emailTitle}
                                    emailDescription={emailDescription}
                                    emailTitleInput={emailTitleInput}
                                    emailDescriptionInput={emailDescriptionInput}
                                    handleEmailTitleChange={handleEmailTitleChange}
                                    handleEmailDescriptionChange={handleEmailDescriptionChange}
                                />
                            }  
                        </ul>
                        <section className="emailconfig-footer">
                            <SaveButton 
                                classNameOverride="emailconfig__savebtn" 
                                saveButtonType='normal' 
                                textfield={'Save Content'}
                                customIcon={<SuccessIcon />} 
                                onClick={() => emailContentSaveHandler()}
                            />
                        </section>
                    </>
                :
                    <EmailSendSection
                        clients={clients}
                        checkedUsers={checkedUsers}
                        emailChanges={emailChanges}
                        checkboxChangeHandler={checkboxChangeHandler}
                        inputChangeHandler={inputChangeHandler}
                        inputBlurHandler={inputBlurHandler}
                    />
                }
                <button onClick={closeEmailClient} className='emailclient-close-btn'>
                    <CloseWindowIcon />
                </button>
                <div className="emailclient__footer">
                    {!emailEditContentActive &&
                        <SaveButton 
                            classNameOverride="send-emails-btn" 
                            saveButtonType={'normal'} 
                            textfield={`Send Emails to Selected Clients`}
                            onClick={() => sendEmailsHandler()}
                            customIcon={<CloudUploadIcon />} 
                        />
                    }
                    <SaveButton 
                        classNameOverride="send-emails-btn" 
                        saveButtonType={emailEditContentActive ? 'normal' : 'normal'} 
                        customIcon={emailEditContentActive ? <NextIcon /> : <TitleIcon />} 
                        textfield={`${emailEditContentActive ? 'Back To Students' : 'Edit Email Content'}`}
                        onClick={() => emailEditContentActive ? setEmailEditContentActive(false) : setEmailEditContentActive(!emailEditContentActive)}
                    />
                </div>
            </section> 
            <AlertPopup
                title={popupContent[0]}
                text={popupContent[1]}
                popupType={popupType}
                show={showPopup}
                onClose={closeAlert}
            />
            <div className={`preventClickBG ${show ? 'fade-in' : 'fade-out'}`}></div>
        </>
    );
};
