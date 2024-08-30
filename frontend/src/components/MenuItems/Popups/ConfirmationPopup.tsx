import { useState } from 'react';
import './ConfirmationPopup.css';
import { ErrorIcon } from '../Icons/ErrorIcon';
import { QuestionIcon } from '../Icons/QuestionIcon';
import { AttentionIcon } from '../Icons/AttentionIcon';
import { SuccessIcon } from '../Icons/SuccessIcon';
import { CloseWindowIcon } from '../Icons/CloseWindowIcon';
import { WarningIcon } from '../Icons/WarningIcon';
import { DeleteButtonSimple } from '../Buttons/DeleteButtonSimple';
import { AddButtonSimple } from '../Buttons/AddButtonSimple';

export type ConfirmationPopupType = 'question' | 'form' | 'warning' | 'question2' | 'warning2';

type Props = {
  title: React.ReactNode;
  text: React.ReactNode;
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
    <div className={`preventClickBG ${(confirmationPopupType === 'warning' || confirmationPopupType === 'warning2') && 'warning'} ${show ? 'fade-in' : 'fade-out '}`}></div>
      <div className={`popup_confirmation 
          ${confirmationPopupType === 'question' ? 'question' 
          : confirmationPopupType === 'question2' ? 'question2'
          : confirmationPopupType === 'form' ? 'success' 
          : confirmationPopupType === 'warning' ? 'warning' : 'warning2'} 
          ${show ? 'fade-in' : 'fade-out'}`}>
            
        <div className="popup_confirmation-content">
          {confirmationPopupType === 'question' || confirmationPopupType === 'question2' ?
            <QuestionIcon />
          : confirmationPopupType === 'form' ?
            <AttentionIcon />
          : confirmationPopupType === 'warning2' ?
            <WarningIcon />
          :
            <ErrorIcon />
          }
          <div className='popup_confirmation-content-text'>
            <h1>{title}</h1>
            <p>{text}</p>
            <div className={'popup_confirmation-content-btn-container ' + (confirmationPopupType === 'form' && 'confirmation')}>
              {confirmationPopupType === 'question' || confirmationPopupType === 'question2' ?
              <>
                <button onClick={() => confirmClickHandler()} className='popup_confirmation-content-btn' type='button'>
                  <SuccessIcon />
                  Yes
                </button>
                <button onClick={abortClick} className='popup_confirmation-content-btn' type='button'>
                  <ErrorIcon />
                  Abort
                </button>
              </>
              : confirmationPopupType === 'warning2' ?
              <>
                <button onClick={abortClick} className='popup_confirmation-content-btn' type='button'>Cancel</button>
                <button onClick={() => confirmClickHandler(inputContent)} className='popup_confirmation-content-btn' type='button'>Delete Permanently</button>
                {/* <AddButtonSimple onClick={abortClick}  text='Cancel'/>
                <DeleteButtonSimple onClick={() => confirmClickHandler(inputContent)} text='Delete Permanently'/> */}
              </>
              : confirmationPopupType === 'form' ?
              <>
                <input className='popup_confirmation-content-input' value={inputContent} onChange={handleInputChange} required type="text" />
                <button onClick={() => confirmClickHandler(inputContent)} className='popup_confirmation-content-btn' type='button'>
                  <SuccessIcon />
                  Confirm
                </button>
                <button onClick={abortClick} className='popup_confirmation-close-btn' type='button'>
                  <CloseWindowIcon />
                </button>
              </>
              :
              <>
                <button onClick={() => confirmClickHandler()} className='popup_confirmation-content-btn' type='button'>
                  <ErrorIcon />
                  Remove
                </button>
                <button onClick={abortClick} className='popup_confirmation-content-btn' type='button'>
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
