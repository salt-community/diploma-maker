import React, { useEffect, useRef, useState } from "react";
import { EmailSendRequest, Student, TemplateResponse } from "../../util/types";
import './EmailClient.css';
import { CloseWindowIcon } from "../MenuItems/Icons/CloseWindowIcon";
import { SaveButton } from "../MenuItems/Buttons/SaveButton";
import { AlertPopup, PopupType } from "../MenuItems/Popups/AlertPopup";
import { SuccessIcon } from "../MenuItems/Icons/SuccessIcon";
import { useCustomAlert } from "../Hooks/useCustomAlert";
import { TitleIcon } from "../MenuItems/Icons/TitleIcon";
import { CloudUploadIcon } from "../MenuItems/Icons/CloudUploadIcon";
import { NextIcon } from "../MenuItems/Icons/NextIcon";
import { EmailContentConfigSection } from "./EmailContentConfigSection";
import { EmailSendSection } from "./EmailSendSection";
import { blendProgress } from "../../util/timeUtil";
import { makeTemplateInput } from "../../templates/baseTemplate";
import { populateField, populateIdField } from "../../util/fieldReplacersUtil";
import { mapTemplateInputsBootcampsToTemplateViewer } from "../../util/dataHelpers";
import { generatePDF } from "../../util/pdfGenerationUtil";
import { InfoPopupType } from "../MenuItems/Popups/InfoPopup";

type Props = {
    clients: Student[];
    items: Student[];
    templates: TemplateResponse[];
    filteredBootcamps: any[];
    title: string | undefined;
    show: boolean;
    closeEmailClient: () => void;
    modifyStudentEmailHandler: (studentInput?: Student, originalEmail?: string) => void;
    sendEmail: (emailRequest: EmailSendRequest) => Promise<void>;
    callCustomAlert: (alertType: PopupType, title: string, content: string) => void;
    setProgress: React.Dispatch<React.SetStateAction<number>>;
    customInfoPopup: (type: InfoPopupType, title: string, content: string, handler: () => ((inputContent?: string) => void) | (() => void)) => void;
};

export const EmailClient = ({ 
    clients, 
    items,
    templates,
    filteredBootcamps,
    title, 
    show, 
    closeEmailClient, 
    modifyStudentEmailHandler, 
    sendEmail, 
    callCustomAlert,
    setProgress,
    customInfoPopup,
}: Props) => {
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

    const sendEmails = async (userIds: string[], title: string, description: string) => {
        if(userIds.length === 0) return
        // @ts-ignore
        customInfoPopup("progress", "Just a minute...", "Mails are journeying through the ether as we speak. Hold tight, your patience is a quiet grace.", () => {});
        const blendProgressDelay = 750;

        for (let i = 0; i < userIds.length; i++) {
            try {
                var file = await generatePDFFile(userIds[i], true);
                var emailSendRequest: EmailSendRequest = {
                    guidId: userIds[i],
                    //@ts-ignore
                    file: file,
                    title: title,
                    description: description,
                }

                await sendEmail(emailSendRequest)
            } catch (error) {
                //@ts-ignore
                customInfoPopup('fail', `Opps, Something went wrong`, `${error}`, () => {});
                return;
            }
           
            const progressBarValue = ((i + 1) / userIds.length) * 100;
            await blendProgress((i / userIds.length) * 100, progressBarValue, blendProgressDelay, setProgress);
        }
    }

    const generatePDFFile = async (guidId: string, emails?: boolean): Promise<Blob | void> => {
        const student = items.find(item => item.guidId === guidId);
        if (!student) {
            customAlert('fail', "Selection Error:", "No Emails Selected");
            return;
        }
        const bootcamp = filteredBootcamps.find(b => b.students.some(d => d.guidId === guidId));

        if (!bootcamp) {
            customAlert('fail', "Bootcamp Error:", "Bootcamp not found");
            return;
        }

        !emails && customAlert('loading', `Generating Pdf File...`, ``);
        
        // displayName: "Fullstack " + TrackName 
        const pdfInput = makeTemplateInput(
            populateField(templates.find(t => t.id === bootcamp.templateId).intro , ("Fullstack " + bootcamp.track.name), bootcamp.graduationDate.toString().slice(0, 10), student.name),
            populateField(student.name, ("Fullstack " + bootcamp.track.name), bootcamp.graduationDate.toString().slice(0, 10), student.name),
            populateField(templates.find(t => t.id === bootcamp.templateId).footer, ("Fullstack " + bootcamp.track.name), bootcamp.graduationDate.toString().slice(0, 10), student.name),
            templates.find(t => t.id === bootcamp.templateId).basePdf,
            populateIdField(templates.find(t => t.id === bootcamp.templateId).link, student.verificationCode)
        );

        const template = mapTemplateInputsBootcampsToTemplateViewer(templates.find(t => t.id === bootcamp.templateId), pdfInput);
        const pdfFile = await generatePDF(template, [pdfInput], true);
        return pdfFile;
    };


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
