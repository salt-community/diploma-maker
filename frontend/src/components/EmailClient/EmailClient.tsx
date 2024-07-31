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
    const [emailConfigActive, setEmailConfigActive] = useState<boolean>(false);
    const [emailContentConfig, setEmailContentConfig] = useState<boolean>(false);

    const senderEmailInput = useRef(null);
    const senderCodeInput = useRef(null);
    const emailTitleInput = useRef(null);
    const emailDescriptionInput = useRef(null)

    const [senderEmail, setSenderEmail] = useState<string>('');
    const [senderCode, setSenderCode] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    
    const [emailTitle, setEmailTitle] = useState<string>('');
    const [emailDescription, setEmailDescription] = useState<string>('');
    
    const [showInstructionSlideshow, setShowInstructionSlideshow] = useState<boolean>(false);

    const {showPopup, popupContent, popupType, customAlert, closeAlert } = useCustomAlert();

    useEffect(() => {
        const emailConfigRequest = JSON.parse(localStorage.getItem('emailConfigRequest'));
        if (emailConfigRequest) {
            setSenderEmail(emailConfigRequest.senderEmail || "");
            setSenderCode(emailConfigRequest.senderCode || "");
        } else {
            setSenderEmail("");
            setSenderCode("");
        }
    
        const storedEmailTitle = localStorage.getItem('emailcontent_title');
        const storedEmailDescription = localStorage.getItem('emailcontent_description');
        setEmailTitle(storedEmailTitle ? JSON.parse(storedEmailTitle) : `<h1>Congratulations, {studentName}! 🎉</h1>`);
        setEmailDescription(storedEmailDescription ? JSON.parse(storedEmailDescription) : `<p>We are thrilled to award you the Salt Diploma. Your hard work and dedication have paid off, and we are excited to see what you accomplish next.</p> <p>Keep striving for greatness, and remember that this is just the beginning of your journey. Well done on completing the bootcamp!</p>`);
    }, []);

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, student: Student) => {
        setEmailChanges({
            ...emailChanges,
            [student.guidId]: event.target.value,
        });
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

    const emailConfigSaveHandler = () => {
        const emailConfigRequest: EmailConfigRequestDto = {
            senderEmail: senderEmailInput.current.value,
            senderCode: senderCodeInput.current.value
        }
        if(emailConfigRequest.senderEmail.trim() === "" || emailConfigRequest.senderCode.trim() === ""){
            customAlert('message',"Cannot update to empty field",`Make sure you don't have empty fields`);
            return;
        }
        try{
            localStorage.setItem('emailConfigRequest', JSON.stringify(emailConfigRequest));
            customAlert('success',"Successfully updated Email Host Configuration",`Email Host Configuration updated with email address ${emailConfigRequest.senderEmail}`);
        }catch(error){
            customAlert('fail',"Email Config Update failure!",`${error} when trying to update email configuration.`);
        }
    }

    const emailContentSaveHandler = () => {
        localStorage.setItem('emailcontent_title', JSON.stringify(emailTitle));
        localStorage.setItem('emailcontent_description', JSON.stringify(emailDescription));
        customAlert('success',"Successfully Saved Email Content",``);
    }

    const handleSenderEmailChange = (event) => {
        setSenderEmail(event.target.value);
    }
    
    const handleSenderCodeChange = (event) => {
        setSenderCode(event.target.value);
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
                {emailConfigActive ?
                    <>
                        <ul className="emailclient__list">
                            {(emailConfigActive && !emailContentConfig) ? 
                                <EmailHostConfigSection
                                    senderEmail={senderEmail}
                                    senderCode={senderCode}
                                    senderEmailInput={senderEmailInput}
                                    senderCodeInput={senderCodeInput}
                                    handleSenderEmailChange={handleSenderEmailChange}
                                    handleSenderCodeChange={handleSenderCodeChange}
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword}
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
                            {emailConfigActive && !emailContentConfig && 
                                <AddButton icon={<HelpIcon />} text='Instructions' onClick={() => {setShowInstructionSlideshow(true)}} />
                            }
                            <SaveButton 
                                classNameOverride="emailconfig__savebtn" 
                                saveButtonType='normal' 
                                textfield={emailConfigActive && !emailContentConfig ? "Save Sender" : "Save Content"} 
                                customIcon={<SuccessIcon />} 
                                onClick={() => (emailConfigActive && !emailContentConfig) ? emailConfigSaveHandler() : emailContentSaveHandler()}
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
                    <SaveButton 
                        classNameOverride="send-emails-btn" 
                        saveButtonType={(emailConfigActive && emailContentConfig) ? 'normal' : 'normal'} 
                        textfield={`${(emailContentConfig && emailConfigActive) ? 'Go back' : emailConfigActive ? 'Edit Email Content'   : 'Send Emails to Selected Clients'}`}
                        onClick={
                            () => 
                                (emailConfigActive && emailContentConfig) ? setEmailContentConfig(false) 
                                : emailConfigActive ? setEmailContentConfig(true) 
                                : sendEmailsHandler()
                            }
                        customIcon={
                                (emailConfigActive && emailContentConfig) ? <NextIcon /> 
                                : emailConfigActive ? <TitleIcon />
                                : <CloudUploadIcon />
                            } 
                    />
                    <SaveButton 
                        classNameOverride="send-emails-btn" 
                        saveButtonType={emailConfigActive ? 'remove' : 'normal'} 
                        customIcon={emailConfigActive ? <CloseIcon /> : <ConfigureIcon />} 
                        textfield={`${emailConfigActive ? 'Close Email Host' : 'Email Host Configuration'}`}
                        onClick={() => {
                            if (emailConfigActive) {
                                setEmailConfigActive(false);
                                setEmailContentConfig(false);
                            } else {
                                setEmailConfigActive(!emailConfigActive);
                            }
                        }}
                    />
                </div>
                
            </section>
            <div className={`preventClickBG ${show ? 'fade-in' : 'fade-out'}`}></div>
            <AlertPopup
                title={popupContent[0]}
                text={popupContent[1]}
                popupType={popupType}
                show={showPopup}
                onClose={closeAlert}
            />
            <InstructionSlideshow show={showInstructionSlideshow}  slides={EmailConfigInstructionSlides} onClose={() => setShowInstructionSlideshow(false)}/>
        </>
    );
};
