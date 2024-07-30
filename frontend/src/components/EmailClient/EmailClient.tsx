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

type Props = {
    clients: Student[],
    title: string | undefined,
    show: boolean,
    closeEmailClient: () => void,
    modifyStudentEmailHandler: (studentInput?: Student, originalEmail?: string) => void,
    sendEmails: (userIds: string[]) => void,
    callCustomAlert: (alertType: PopupType, title: string, content: string) => void,
};

export const EmailClient = ({ clients, title, show, closeEmailClient, modifyStudentEmailHandler, sendEmails, callCustomAlert }: Props) => {
    const [emailChanges, setEmailChanges] = useState<{[key: string]: string}>({});
    const [checkedUsers, setCheckedUsers] = useState<{[key: string]: boolean}>({});
    const [emailConfigActive, setEmailConfigActive] = useState<boolean>(false);

    const senderEmailInput = useRef(null);
    const senderCodeInput = useRef(null);
    const emailTitleInput = useRef(null);
    const emailDescriptionInput = useRef(null)

    const [senderEmail, setSenderEmail] = useState<string>('');
    const [senderCode, setSenderCode] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    
    const [emailTitle, setEmailTitle] = useState<string>(`<h1>Congratulations, {studentName}! 🎉</h1>`);
    const [emailDescription, setEmailDescription] = useState<string>(`<p>We are thrilled to award you the Salt Diploma. Your hard work and dedication have paid off, and we are excited to see what you accomplish next.</p> <p>Keep striving for greatness, and remember that this is just the beginning of your journey. Well done on completing the bootcamp!</p>`);
    
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
        sendEmails(selectedIds);
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
                            <li className="emailclient__list--item">
                                <EmailIcon />
                                <div className="emailclient__list--input-wrapper">
                                    <h3>Sender Email</h3>
                                    <input 
                                        className="emailclient__list--input" 
                                        type="text" 
                                        ref={senderEmailInput}
                                        onChange={handleSenderEmailChange}
                                        value={senderEmail}
                                    />
                                </div>
                            </li>
                            <li className="emailclient__list--item">
                                <PasswordIcon />
                                <div className="emailclient__list--input-wrapper">
                                    <h3>Sender Code</h3>
                                    <input
                                        className="emailclient__list--input"
                                        type={showPassword ? "text" : "password"}
                                        ref={senderCodeInput}
                                        onChange={handleSenderCodeChange}
                                        value={senderCode}
                                    />
                                    <div
                                        className="password-visibility-toggle"
                                        onMouseDown={() => setShowPassword(true)}
                                        onMouseUp={() => setShowPassword(false)}
                                        onMouseLeave={() => setShowPassword(false)}
                                    >
                                        {showPassword ? 
                                            <MountainIcon />
                                        : 
                                            <EyeIcon /> 
                                        }
                                    </div>
                                </div>
                            </li>
                            <li className="emailclient__list--item editfields">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 6V19M6 6H18" stroke="#ababba" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                <div className="emailclient__list--input-wrapper editfields">
                                    <h3>Title</h3>
                                    <input
                                        className="emailclient__list--input editfields"
                                        type="text"
                                        ref={emailTitleInput}
                                        onChange={handleEmailTitleChange}
                                        value={emailTitle}
                                    />
                                </div>
                            </li>
                            <li className="emailclient__list--item editfields">
                                <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="var(--ci-primary-color, #ababba)" d="M334.627,16H48V496H472V153.373ZM440,166.627V168H320V48h1.373ZM80,464V48H288V200H440V464Z" className="ci-primary"></path> <rect width="224" height="32" x="136" y="296" fill="var(--ci-primary-color, #ababba)" className="ci-primary"></rect> <rect width="224" height="32" x="136" y="376" fill="var(--ci-primary-color, #ababba)" className="ci-primary"></rect> </g></svg>
                                <div className="emailclient__list--input-wrapper editfields">
                                    <h3>Description</h3>
                                    <input
                                        className="emailclient__list--input editfields"
                                        type="text"
                                        ref={emailDescriptionInput}
                                        onChange={handleEmailDescriptionChange}
                                        value={emailDescription}
                                    />
                                </div>
                            </li>
                        </ul>
                        <section className="emailconfig-footer">
                            <AddButton icon={<HelpIcon />} text='Instructions' onClick={() => {setShowInstructionSlideshow(true)}} />
                            <SaveButton classNameOverride="emailconfig__savebtn" saveButtonType='normal' textfield="Save Changes" customIcon={<SuccessIcon />} onClick={() => emailConfigSaveHandler()}/>
                        </section>
                    </>
                :
                    <ul className="emailclient__list">
                        <label className="emailclient__list-label">Send Toggle</label>
                        {clients.map((student: Student) => (
                            <li key={student.guidId} className="emailclient__list--item">
                                <CustomCheckBoxRound 
                                    checked={!!checkedUsers[student.guidId]} 
                                    onChange={(event) => checkboxChangeHandler(event, student.guidId)} 
                                />
                                <h3>{student.name}</h3>
                                <div className="emailclient__list--input-wrapper">
                                    <input 
                                        className="emailclient__list--input" 
                                        type="text" 
                                        value={emailChanges[student.guidId] || student.email || 'No Email'} 
                                        onChange={(event) => inputChangeHandler(event, student)} 
                                        onBlur={() => inputBlurHandler(student)} 
                                    />
                                    <CogWheelIcon />
                                </div>
                                
                            </li>
                        ))}
                    </ul>
                }
                <button onClick={closeEmailClient} className='emailclient-close-btn'>
                    <CloseWindowIcon />
                </button>
                <div className="emailclient__footer">
                    <SaveButton disabled={emailConfigActive} classNameOverride="send-emails-btn" saveButtonType={'normal'} textfield="Send Emails to Selected Clients" onClick={sendEmailsHandler}/>
                    <SaveButton classNameOverride="send-emails-btn" saveButtonType={emailConfigActive ? 'remove' : 'normal'} customIcon={emailConfigActive ? <CloseIcon /> : <ConfigureIcon />} textfield={`${emailConfigActive ? 'Close Email Host' : 'Email Host Configuration'}`} onClick={() => setEmailConfigActive(!emailConfigActive)}/>
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
