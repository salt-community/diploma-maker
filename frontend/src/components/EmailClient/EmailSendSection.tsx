import React from 'react';
import { Student } from "../../util/types";
import CustomCheckBoxRound from "../MenuItems/Inputs/CustomCheckBoxRound";
import { CogWheelIcon } from "../MenuItems/Icons/CogWheelIcon";

type Props = {
    clients: Student[];
    checkedUsers: {[key: string]: boolean};
    emailChanges: {[key: string]: string};
    checkboxChangeHandler: (event: React.ChangeEvent<HTMLInputElement>, studentId: string) => void;
    inputChangeHandler: (event: React.ChangeEvent<HTMLInputElement>, student: Student) => void;
    inputBlurHandler: (student: Student) => void;
};

export const EmailSendSection = ({ clients, checkedUsers, emailChanges, checkboxChangeHandler, inputChangeHandler, inputBlurHandler }: Props) => {
    return (
        <>
            
            <ul className="emailclient__list">
                <label className="emailclient__list-label">Send Toggle</label>
                <div className='overflow-container'>
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
                                    value={emailChanges[student.guidId!] !== undefined ? emailChanges[student.guidId!] : student.email || ''} 
                                    onChange={(event) => inputChangeHandler(event, student)} 
                                    onBlur={() => inputBlurHandler(student)} 
                                    placeholder={emailChanges[student.email!] === '' ? 'No Email' : 'No Email'}
                                />
                                <CogWheelIcon />
                            </div>
                        </li>
                    ))}
                </div>
            </ul>
        </>
    );
};