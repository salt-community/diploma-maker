import { useState } from 'react';
import './ConfirmationPopup.css';
import { ErrorIcon } from '../Icons/ErrorIcon';
import { QuestionIcon } from '../Icons/QuestionIcon';
import { AttentionIcon } from '../Icons/AttentionIcon';
import { SuccessIcon } from '../Icons/SuccessIcon';
import { CloseWindowIcon } from '../Icons/CloseWindowIcon';

export enum ConfirmationPopupType {
  question,
  form,
  warning
}

type Props = {
  title: string;
  text: string;
  show: boolean;
  confirmationPopupType: ConfirmationPopupType;
  confirmClick: (inputContent?: string) => void;
  abortClick: () => void;
}

export const ConfirmationPopup = ({ show, confirmationPopupType, title, text, confirmClick, abortClick }: Props) => {
  const [inputContent, setInputContent] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputContent(event.target.value);
  };

  const confirmClickHandler = (inputContent?: string) => {
    if(inputContent){
      confirmClick(inputContent);
      setTimeout(() => {
        setInputContent('');
      }, 1500);
    }
    else{
      confirmClick();
    }
  }

  return (
    <>
    <div className={`preventClickBG ${show ? 'fade-in' : 'fade-out'}`}></div>
      <div className={`popup_confirmation 
          ${confirmationPopupType === ConfirmationPopupType.question ? 'question' 
          : confirmationPopupType === ConfirmationPopupType.form ? 'success' : 'warning'} 
          ${show ? 'fade-in' : 'fade-out'}`}>
            
        <div className="popup_confirmation-content">
          {confirmationPopupType === ConfirmationPopupType.question ?
            <QuestionIcon />
          : confirmationPopupType === ConfirmationPopupType.form ?
            <AttentionIcon />
          :
            <ErrorIcon />
          }
          <div className='popup_confirmation-content-text'>
            <h1>{title}</h1>
            <p>{text}</p>
            <div className={'popup_confirmation-content-btn-container ' + (confirmationPopupType === ConfirmationPopupType.form && 'confirmation')}>
              {confirmationPopupType === ConfirmationPopupType.question ?
              <>
                <button onClick={() => confirmClickHandler()} className='popup_confirmation-content-btn'>
                  <SuccessIcon />
                  Yes
                </button>
                <button onClick={abortClick} className='popup_confirmation-content-btn'>
                  <ErrorIcon />
                  Abort
                </button>
              </>
              : confirmationPopupType === ConfirmationPopupType.form ?
              <>
                <input className='popup_confirmation-content-input' value={inputContent} onChange={handleInputChange} required type="text" />
                <button onClick={() => confirmClickHandler(inputContent)} className='popup_confirmation-content-btn'>
                  <SuccessIcon />
                  Confirm
                </button>
                <button onClick={abortClick} className='popup_confirmation-close-btn'>
                  <CloseWindowIcon />
                </button>
              </>
              :
              <>
                <button onClick={() => confirmClickHandler()} className='popup_confirmation-content-btn'>
                  <ErrorIcon />
                  Remove
                </button>
                <button onClick={abortClick} className='popup_confirmation-content-btn'>
                  <SuccessIcon />
                  Abort
                </button>
              </>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
