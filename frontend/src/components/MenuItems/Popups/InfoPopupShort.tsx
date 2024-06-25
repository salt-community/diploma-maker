import { useEffect, useState } from 'react';
import './InfoPopupShort.css';
import { SuccessIcon } from '../Icons/SuccessIcon';
import { CloseWindowIcon } from '../Icons/CloseWindowIcon';

export enum InfoPopupType {
  question,
  form,
  warning
}

type Props = {
  title: string;
  text: string;
  show: boolean;
  infoPopupType: InfoPopupType;
  confirmClick: (inputContent?: string) => void;
  abortClick: () => void;
}

export const InfoPopupShort = ({ show, infoPopupType, title, text, confirmClick, abortClick }: Props) => {
  const [inputContent, setInputContent] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputContent(event.target.value);
  };

  useEffect(() => {
    setInputContent(text);
  }, [])

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
          ${infoPopupType === InfoPopupType.form ? 'form' : 'warning'} 
          ${show ? 'fade-in' : 'fade-out'}`}>
        <div className="popup_confirmation-content">
          {infoPopupType === InfoPopupType.form &&
            <svg version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#197eff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><g> 
              <path className="st0" d="M505.837,180.418L279.265,76.124c-7.349-3.385-15.177-5.093-23.265-5.093c-8.088,0-15.914,1.708-23.265,5.093 L6.163,180.418C2.418,182.149,0,185.922,0,190.045s2.418,7.896,6.163,9.627l226.572,104.294c7.349,3.385,15.177,5.101,23.265,5.101 c8.088,0,15.916-1.716,23.267-5.101l178.812-82.306v82.881c-7.096,0.8-12.63,6.84-12.63,14.138c0,6.359,4.208,11.864,10.206,13.618 l-12.092,79.791h55.676l-12.09-79.791c5.996-1.754,10.204-7.259,10.204-13.618c0-7.298-5.534-13.338-12.63-14.138v-95.148 l21.116-9.721c3.744-1.731,6.163-5.504,6.163-9.627S509.582,182.149,505.837,180.418z"></path> 
              <path className="st0" d="M256,346.831c-11.246,0-22.143-2.391-32.386-7.104L112.793,288.71v101.638 c0,22.314,67.426,50.621,143.207,50.621c75.782,0,143.209-28.308,143.209-50.621V288.71l-110.827,51.017 C278.145,344.44,267.25,346.831,256,346.831z"></path> </g> </g>
            </svg>
          }
          <div className='popup_confirmation-content-text'>
            <h1>{title}</h1>
            <div className={'popup_confirmation-content-btn-container ' + (infoPopupType === InfoPopupType.form && 'confirmation')}>
              {infoPopupType === InfoPopupType.form &&
                <>
                  <input className="popup_confirmation-input" type="text" value={inputContent} placeholder={text} onChange={handleInputChange}></input>
                  <button onClick={() => confirmClickHandler(inputContent)} className='popup_confirmation-content-btn'>
                    <SuccessIcon />
                    Save Changes
                  </button>
                  <button onClick={abortClick} className='popup_confirmation-close-btn'>
                    <CloseWindowIcon />
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
