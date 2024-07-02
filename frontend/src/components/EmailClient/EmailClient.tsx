import React, { useState } from "react";
import { Student } from "../../util/types";
import './EmailClient.css';
import { CloseWindowIcon } from "../MenuItems/Icons/CloseWindowIcon";
import { CogWheelIcon } from "../MenuItems/Icons/CogWheelIcon";
import { SaveButton, SaveButtonType } from "../MenuItems/Buttons/SaveButton";
import { PopupType } from "../MenuItems/Popups/AlertPopup";
import { CircleIcon } from "../MenuItems/Icons/CircleIcon";
import CustomCheckBoxRound from "../MenuItems/Inputs/CustomCheckBoxRound";

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
                            <CustomCheckBoxRound 
                                checked={!!checkedUsers[student.guidId]} 
                                onChange={(event) => checkboxChangeHandler(event, student.guidId)} 
                            />
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
