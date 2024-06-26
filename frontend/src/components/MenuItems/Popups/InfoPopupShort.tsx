import { useEffect, useState } from 'react';
import './InfoPopupShort.css';
import { SuccessIcon } from '../Icons/SuccessIcon';
import { CloseWindowIcon } from '../Icons/CloseWindowIcon';
import { delay } from '../../../util/helper';

export enum InfoPopupType {
  form,
  progress,
}

type Props = {
  title: string;
  text: string;
  show: boolean;
  infoPopupType: InfoPopupType;
  confirmClick: (inputContent?: string) => void;
  abortClick: () => void;
  currentProgress?: number;
}

export const InfoPopupShort = ({ show, infoPopupType, title, text, confirmClick, abortClick, currentProgress }: Props) => {
  const [inputContent, setInputContent] = useState<string>('');
  const [finished, setFinished] = useState<boolean>(true);

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
    console.log(finished);
    if(currentProgress >= 99){
      setFinished(true);
    }
  }, [currentProgress])

  return (
    <>
    <div className={`preventClickBG ${show ? 'fade-in' : 'fade-out'}`}></div>
      <div className={`popup_confirmation 
          ${infoPopupType === InfoPopupType.form ? 'form' : finished ? 'progress finished' : 'progress'} 
          ${show ? 'fade-in ' : 'fade-out '}`}>
        <div className="popup_confirmation-content">
          {infoPopupType === InfoPopupType.form ?
            <svg version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#197eff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><g> 
              <path className="st0" d="M505.837,180.418L279.265,76.124c-7.349-3.385-15.177-5.093-23.265-5.093c-8.088,0-15.914,1.708-23.265,5.093 L6.163,180.418C2.418,182.149,0,185.922,0,190.045s2.418,7.896,6.163,9.627l226.572,104.294c7.349,3.385,15.177,5.101,23.265,5.101 c8.088,0,15.916-1.716,23.267-5.101l178.812-82.306v82.881c-7.096,0.8-12.63,6.84-12.63,14.138c0,6.359,4.208,11.864,10.206,13.618 l-12.092,79.791h55.676l-12.09-79.791c5.996-1.754,10.204-7.259,10.204-13.618c0-7.298-5.534-13.338-12.63-14.138v-95.148 l21.116-9.721c3.744-1.731,6.163-5.504,6.163-9.627S509.582,182.149,505.837,180.418z"></path> 
              <path className="st0" d="M256,346.831c-11.246,0-22.143-2.391-32.386-7.104L112.793,288.71v101.638 c0,22.314,67.426,50.621,143.207,50.621c75.782,0,143.209-28.308,143.209-50.621V288.71l-110.827,51.017 C278.145,344.44,267.25,346.831,256,346.831z"></path> </g> </g>
            </svg>
          : finished ? 
                <SuccessIcon />
          :
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> 
              <path fill-rule="evenodd" clip-rule="evenodd" d="M8 10C8 7.79086 9.79086 6 12 6C14.2091 6 16 7.79086 16 10V11H17C18.933 11 20.5 12.567 20.5 14.5C20.5 16.433 18.933 18 17 18H16C15.4477 18 15 18.4477 15 19C15 19.5523 15.4477 20 16 20H17C20.0376 20 22.5 17.5376 22.5 14.5C22.5 11.7793 20.5245 9.51997 17.9296 9.07824C17.4862 6.20213 15.0003 4 12 4C8.99974 4 6.51381 6.20213 6.07036 9.07824C3.47551 9.51997 1.5 11.7793 1.5 14.5C1.5 17.5376 3.96243 20 7 20H8C8.55228 20 9 19.5523 9 19C9 18.4477 8.55228 18 8 18H7C5.067 18 3.5 16.433 3.5 14.5C3.5 12.567 5.067 11 7 11H8V10ZM15.7071 13.2929L12.7071 10.2929C12.3166 9.90237 11.6834 9.90237 11.2929 10.2929L8.29289 13.2929C7.90237 13.6834 7.90237 14.3166 8.29289 14.7071C8.68342 15.0976 9.31658 15.0976 9.70711 14.7071L11 13.4142V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V13.4142L14.2929 14.7071C14.6834 15.0976 15.3166 15.0976 15.7071 14.7071C16.0976 14.3166 16.0976 13.6834 15.7071 13.2929Z" fill="#537dfc"></path> </g>
            </svg>
          }
          <div className='popup_confirmation-content-text'>
            {infoPopupType === InfoPopupType.form ?
              <h1>{title}</h1>
            :
              <div className='popup_confirmation-content-text__title_wrapper'>
                <h1>{finished ? 'Finshed!' : title}</h1>
                <p>{finished ? 'All Emails Sent out Successfully' : text}</p>
              </div>
            }
            <div className={'popup_confirmation-content-btn-container ' + (infoPopupType === InfoPopupType.form ? 'confirmation' : 'progress')}>
              {infoPopupType === InfoPopupType.form ?
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
                  <button onClick={() => {abortClick(); setFinished(false);}} className={'popup_confirmation-content-btn ' + (finished && 'finished')}>
                    {finished ? 'Done' : 'Cancel'}
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