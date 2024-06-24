import { useState } from 'react';
import './ConfirmationPopup.css';

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
      <div className={`popup_confirmation ${confirmationPopupType === ConfirmationPopupType.question ? 'question' : confirmationPopupType === ConfirmationPopupType.form ? 'success' : 'warning'} ${show ? 'fade-in' : 'fade-out'}`}>
        <div className="popup_confirmation-content">
          {confirmationPopupType === ConfirmationPopupType.question ?
            <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier">
              <path fillRule="evenodd" d="M11 11H9v-.148c0-.876.306-1.499 1-1.852.385-.195 1-.568 1-1a1.001 1.001 0 00-2 0H7c0-1.654 1.346-3 3-3s3 1 3 3-2 2.165-2 3zm-2 4h2v-2H9v2zm1-13a8 8 0 100 16 8 8 0 000-16z" fill="#FF683F"></path></g>
            </svg>
          : confirmationPopupType === ConfirmationPopupType.form ?
            <svg fill="#197eff" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" enableBackground="new 0 0 512 512"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> 
              <path d="M256,0C114.609,0,0,114.609,0,256s114.609,256,256,256s256-114.609,256-256S397.391,0,256,0z M256,472 c-119.297,0-216-96.703-216-216S136.703,40,256,40s216,96.703,216,216S375.297,472,256,472z"></path> <polygon points="240,234.656 246.234,320 265.781,320 272,233.875 272,128 240,128 "></polygon> <rect x="240" y="352" width="32" height="32"></rect> </g> </g>
            </svg>
          :
            <svg viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
              <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> 
              <g id="Icon-Set-Filled" transform="translate(-570.000000, -1089.000000)" fill="#ff5563"> 
              <path d="M591.657,1109.24 C592.048,1109.63 592.048,1110.27 591.657,1110.66 C591.267,1111.05 590.633,1111.05 590.242,1110.66 L586.006,1106.42 L581.74,1110.69 C581.346,1111.08 580.708,1111.08 580.314,1110.69 C579.921,1110.29 579.921,1109.65 580.314,1109.26 L584.58,1104.99 L580.344,1100.76 C579.953,1100.37 579.953,1099.73 580.344,1099.34 C580.733,1098.95 581.367,1098.95 581.758,1099.34 L585.994,1103.58 L590.292,1099.28 C590.686,1098.89 591.323,1098.89 591.717,1099.28 C592.11,1099.68 592.11,1100.31 591.717,1100.71 L587.42,1105.01 L591.657,1109.24 L591.657,1109.24 Z M586,1089 C577.163,1089 570,1096.16 570,1105 C570,1113.84 577.163,1121 586,1121 C594.837,1121 602,1113.84 602,1105 C602,1096.16 594.837,1089 586,1089 L586,1089 Z" id="cross-circle"> </path> </g> </g> </g>
            </svg>
          }
          <div className='popup_confirmation-content-text'>
            <h1>{title}</h1>
            <p>{text}</p>
            <div className={'popup_confirmation-content-btn-container ' + (confirmationPopupType === ConfirmationPopupType.form && 'confirmation')}>
              {confirmationPopupType === ConfirmationPopupType.question ?
              <>
                <button onClick={() => confirmClickHandler()} className='popup_confirmation-content-btn'>
                  <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="" stroke="" strokeWidth="0.01024">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                    <g id="SVGRepo_iconCarrier">
                    <path fill="#0affa5" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336L456.192 600.384z"/>
                    </g>
                  </svg>
                  Yes
                </button>
                <button onClick={abortClick} className='popup_confirmation-content-btn'>
                  <svg viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> 
                    <g id="Icon-Set-Filled" transform="translate(-570.000000, -1089.000000)" fill="#ff5563"> 
                    <path d="M591.657,1109.24 C592.048,1109.63 592.048,1110.27 591.657,1110.66 C591.267,1111.05 590.633,1111.05 590.242,1110.66 L586.006,1106.42 L581.74,1110.69 C581.346,1111.08 580.708,1111.08 580.314,1110.69 C579.921,1110.29 579.921,1109.65 580.314,1109.26 L584.58,1104.99 L580.344,1100.76 C579.953,1100.37 579.953,1099.73 580.344,1099.34 C580.733,1098.95 581.367,1098.95 581.758,1099.34 L585.994,1103.58 L590.292,1099.28 C590.686,1098.89 591.323,1098.89 591.717,1099.28 C592.11,1099.68 592.11,1100.31 591.717,1100.71 L587.42,1105.01 L591.657,1109.24 L591.657,1109.24 Z M586,1089 C577.163,1089 570,1096.16 570,1105 C570,1113.84 577.163,1121 586,1121 C594.837,1121 602,1113.84 602,1105 C602,1096.16 594.837,1089 586,1089 L586,1089 Z" id="cross-circle"> </path> </g> </g> </g>
                  </svg>
                  Abort
                </button>
              </>
              : confirmationPopupType === ConfirmationPopupType.form ?
              <>
                <input className='popup_confirmation-content-input' value={inputContent} onChange={handleInputChange} required type="text" />
                <button onClick={() => confirmClickHandler(inputContent)} className='popup_confirmation-content-btn'>
                  <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="" stroke="" strokeWidth="0.01024">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                    <g id="SVGRepo_iconCarrier">
                    <path fill="#0affa5" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336L456.192 600.384z"/>
                    </g>
                  </svg>
                  Confirm
                </button>
                <button onClick={abortClick} className='popup_confirmation-close-btn'>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                    <g id="SVGRepo_iconCarrier"> <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z" fill="#ababba"/> </g>
                  </svg>
                </button>
              </>
              :
              <>
                <button onClick={() => confirmClickHandler()} className='popup_confirmation-content-btn'>
                  <svg viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> 
                    <g id="Icon-Set-Filled" transform="translate(-570.000000, -1089.000000)" fill="#ff5563"> 
                    <path d="M591.657,1109.24 C592.048,1109.63 592.048,1110.27 591.657,1110.66 C591.267,1111.05 590.633,1111.05 590.242,1110.66 L586.006,1106.42 L581.74,1110.69 C581.346,1111.08 580.708,1111.08 580.314,1110.69 C579.921,1110.29 579.921,1109.65 580.314,1109.26 L584.58,1104.99 L580.344,1100.76 C579.953,1100.37 579.953,1099.73 580.344,1099.34 C580.733,1098.95 581.367,1098.95 581.758,1099.34 L585.994,1103.58 L590.292,1099.28 C590.686,1098.89 591.323,1098.89 591.717,1099.28 C592.11,1099.68 592.11,1100.31 591.717,1100.71 L587.42,1105.01 L591.657,1109.24 L591.657,1109.24 Z M586,1089 C577.163,1089 570,1096.16 570,1105 C570,1113.84 577.163,1121 586,1121 C594.837,1121 602,1113.84 602,1105 C602,1096.16 594.837,1089 586,1089 L586,1089 Z" id="cross-circle"> </path> </g> </g> </g>
                  </svg>
                  Remove
                </button>
                <button onClick={abortClick} className='popup_confirmation-content-btn'>
                  <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="" stroke="" strokeWidth="0.01024">
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                      <g id="SVGRepo_iconCarrier">
                      <path fill="#0affa5" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336L456.192 600.384z"/>
                      </g>
                  </svg>
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
