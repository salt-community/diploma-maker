import { useEffect, useState } from 'react';
import './InfoPopup.css';
import { SuccessIcon } from '../Icons/SuccessIcon';
import { CloseWindowIcon } from '../Icons/CloseWindowIcon';
import { ErrorIcon } from '../Icons/ErrorIcon';
import { StudentHatIcon } from '../Icons/StudentHatIcon';
import { CloudUploadThickIcon } from '../Icons/CloudUploadThickIcon';
import { delay } from '../../../util/timeUtil';

export type InfoPopupType = 'form' | 'progress' | 'fail';

type Props = {
  title: string;
  text: string;
  show: boolean;
  infoPopupType: InfoPopupType;
  confirmClick: (inputContent?: string) => void;
  abortClick: () => void;
  currentProgress?: number;
  setCurrentProgress: (value: number) => void;
  cancel?: () => void;
}

export const InfoPopup = ({ show, infoPopupType, title, text, confirmClick, abortClick, currentProgress, setCurrentProgress, cancel }: Props) => {
  const [inputContent, setInputContent] = useState<string>('');
  const [finished, setFinished] = useState<boolean>(false);
  const [cancelled, setCancelled] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputContent(event.target.value);
  };

  useEffect(() => {
    setInputContent(text);
  }, [title, text])

  const confirmClickHandler = (inputContent?: string) => {
    if(inputContent){
      confirmClick(inputContent);
      // setTimeout(() => {
      //   setInputContent('');
      // }, 1500);
    }
    else{
      confirmClick();
    }
  }

  useEffect(() => {
    //@ts-ignore
    if(currentProgress >= 99){
      setFinished(true);
    }
  }, [currentProgress])

  const closeProgressWindowHandler = async () => {
    abortClick(); 
    await delay(750)
    setFinished(false);
    setCancelled(false);
    setCurrentProgress(0);
  }

  const cancelHandler = async () => {
    if(cancelled === false && !finished){
      cancel();
      setCancelled(true);
    } else{
      await closeProgressWindowHandler() 
    }
  }

  return (
    <>
    <div className={`preventClickBGinfo ${show ? 'fade-in' : 'fade-out'}`}></div>
      <div className={`popup_confirmation
          ${infoPopupType === 'fail' ? 'fail' : infoPopupType === 'form' ? 'form' : finished ? 'finished' : 'progress'} 
          ${show ? 'fade-in ' : 'fade-out '}`}>
        <div className="popup_confirmation-content">
          {infoPopupType === 'form' ?
            <StudentHatIcon />
          : infoPopupType === 'fail' ?
            <ErrorIcon />
          : finished ? 
            <SuccessIcon />
          :
            <CloudUploadThickIcon />
          }
          <div className='popup_confirmation-content-text'>
            {infoPopupType === 'form' ?
              <h1>{title}</h1>
            :
              <div className='popup_confirmation-content-text__title_wrapper'>
                <h1>{finished ? 'Finshed!' : title}</h1>
                <p><span>{finished ? 'All Emails Sent out Successfully!' : text}</span></p>
              </div>
            }
            <div className={'popup_confirmation-content-btn-container ' + (infoPopupType === 'form' ? 'confirmation' : 'progress')}>
              {infoPopupType === 'form' ?
                <>
                  <input className="popup_confirmation-input" type="text" value={inputContent} onChange={handleInputChange}></input>
                  <button onClick={() => confirmClickHandler(inputContent)} className='popup_confirmation-content-btn'>
                    <SuccessIcon />
                    Save
                  </button>
                  <button onClick={abortClick} className='popup_confirmation-close-btn'>
                    <CloseWindowIcon />
                  </button>
                </>
              : 
                <>
                  <div className='progress-wrapper'>
                    <label htmlFor="progress-bar">{currentProgress}%</label>
                    <progress id="progress-bar" value={currentProgress} max="100"></progress>
                  </div>
                  <button onClick={() => cancelHandler()} 
                    className={'popup_confirmation-content-btn ' + (finished ? 'finished' : 'progress')}
                  >
                    {infoPopupType === 'fail' ?
                     'Exit'
                    :
                    finished || cancelled ? 'Done' : 'Cancel'}
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