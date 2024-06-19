import { useState, useEffect } from 'react';
import './AlertPopup.css';

export enum PopupType {
  success,
  fail,
}

type Props = {
  title: string;
  text: string;
  show: boolean;
  onClose: () => void;
  popupType: PopupType;
  durationOverride?: number;
}

export const AlertPopup = ({ show, onClose, popupType, title, text, durationOverride }: Props) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    let timer: any;
    let visibleTime = durationOverride ? durationOverride : 2000;

    if (show) {
      setVisible(true);
      timer = setTimeout(() => {
        setVisible(false);
      }, visibleTime);
    }

    return () => clearTimeout(timer);
  }, [show]);

  useEffect(() => {
    if (!visible && show) {
      const timer = setTimeout(onClose, 300);
      return () => clearTimeout(timer);
    }
  }, [visible, show, onClose]);

  return (
    <div onClick={() => {alert("clicked")}} className={`popup ${popupType === PopupType.fail ? 'fail' : 'success'} ${visible ? 'fade-in' : 'fade-out'}`}>
      <div className="popup-content">
        {popupType === PopupType.fail ? 
          <svg viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fill-rule="evenodd"> 
            <g id="Icon-Set-Filled" transform="translate(-570.000000, -1089.000000)" fill="#f66898"> 
            <path d="M591.657,1109.24 C592.048,1109.63 592.048,1110.27 591.657,1110.66 C591.267,1111.05 590.633,1111.05 590.242,1110.66 L586.006,1106.42 L581.74,1110.69 C581.346,1111.08 580.708,1111.08 580.314,1110.69 C579.921,1110.29 579.921,1109.65 580.314,1109.26 L584.58,1104.99 L580.344,1100.76 C579.953,1100.37 579.953,1099.73 580.344,1099.34 C580.733,1098.95 581.367,1098.95 581.758,1099.34 L585.994,1103.58 L590.292,1099.28 C590.686,1098.89 591.323,1098.89 591.717,1099.28 C592.11,1099.68 592.11,1100.31 591.717,1100.71 L587.42,1105.01 L591.657,1109.24 L591.657,1109.24 Z M586,1089 C577.163,1089 570,1096.16 570,1105 C570,1113.84 577.163,1121 586,1121 C594.837,1121 602,1113.84 602,1105 C602,1096.16 594.837,1089 586,1089 L586,1089 Z" id="cross-circle"> </path> </g> </g> </g>
          </svg>
          :
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="" stroke="" strokeWidth="0.01024">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
            <g id="SVGRepo_iconCarrier">
            <path fill="#0affa5" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336L456.192 600.384z"/>
            </g>
          </svg>
        }
        <div className='popup-content-text'>
          <h1>{title}</h1>
          <p>{text}</p>
        </div>
      </div>
    </div>
  );
};
