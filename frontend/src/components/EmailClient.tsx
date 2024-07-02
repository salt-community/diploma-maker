import React, { useState } from "react";
import { Student } from "../util/types";
import './EmailClient.css';
import { CloseWindowIcon } from "./MenuItems/Icons/CloseWindowIcon";
import { CogWheelIcon } from "./MenuItems/Icons/CogWheelIcon";
import { SaveButton, SaveButtonType } from "./MenuItems/Buttons/SaveButton";
import { PopupType } from "./MenuItems/Popups/AlertPopup";

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
            callCustomAlert(PopupType.fail, `Failure in sending emails`, `Cannot send email to ${studentNullEmail.name} as their email address is missing.`);
            return;
        }
        sendEmails(selectedIds);
    }

    return (
        <>
            <section className={"emailclient " + (show ? 'fade-in' : 'fade-out')}>
                <header className="emailclient__header">
                    <h1>{title}</h1>
                    <h2>Students</h2>
                </header>
                <ul className="emailclient__list">
                    {clients.map((student: Student) => (
                        <li key={student.guidId} className="emailclient__list--item">
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
                            <div className="checkbox-wrapper-31">
                                <input 
                                    type="checkbox" 
                                    checked={!!checkedUsers[student.guidId]} 
                                    onChange={(event) => checkboxChangeHandler(event, student.guidId)} 
                                />
                                <svg viewBox="0 0 35.6 35.6">
                                    <circle className="background" cx="17.8" cy="17.8" r="17.8"></circle>
                                    <circle className="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
                                    <polyline className="check" points="11.78 18.12 15.55 22.23 25.17 12.87"></polyline>
                                </svg>
                            </div>
                        </li>
                    ))}
                </ul>
                <button onClick={closeEmailClient} className='emailclient-close-btn'>
                    <CloseWindowIcon />
                </button>
                <SaveButton classNameOverride="send-emails-btn" saveButtonType={SaveButtonType.normal} textfield="Send Emails to Selected Clients" onClick={sendEmailsHandler}/>
            </section>
            <div className={`preventClickBG ${show ? 'fade-in' : 'fade-out'}`}></div>
        </>
    );
};
