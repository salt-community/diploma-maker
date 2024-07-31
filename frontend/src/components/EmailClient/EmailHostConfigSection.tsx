import React from 'react';
import { EmailIcon } from "../MenuItems/Icons/EmailIcon";
import { PasswordIcon } from "../MenuItems/Icons/PasswordIcon";
import { MountainIcon } from "../MenuItems/Icons/MountainIcon";
import { EyeIcon } from "../MenuItems/Icons/EyeIcon";

type Props = {
    senderEmail: string;
    senderCode: string;
    senderEmailInput: React.RefObject<HTMLInputElement>;
    senderCodeInput: React.RefObject<HTMLInputElement>;
    handleSenderEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSenderCodeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
};

export const EmailHostConfigSection = ({ senderEmail, senderCode, senderEmailInput, senderCodeInput, handleSenderEmailChange, handleSenderCodeChange, showPassword, setShowPassword }: Props) => {
    return (
        <>
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
        </>
    );
};