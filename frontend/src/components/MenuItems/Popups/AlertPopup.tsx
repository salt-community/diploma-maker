import { useState, useEffect } from 'react';
import './AlertPopup.css';
import { PopupAlertIcon } from '../Icons/PopupAlertIcon';
import { PopupSuccessIcon } from '../Icons/PopupSuccessIcon';
import { AttentionIcon } from '../Icons/AttentionIcon';
import { SpinnerIcon } from '../Icons/SpinnerIcon';

export type PopupType = 'success' | 'fail' | 'message' | 'loading'

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
    let visibleTime = durationOverride ? durationOverride : 2500;
  
    if (show && popupType !== 'loading') {
      setVisible(true);
      timer = setTimeout(() => {
        setVisible(false);
      }, visibleTime);
    } else if (popupType === 'loading') {
      setVisible(true);
    }
  
    return () => clearTimeout(timer);
  }, [show, popupType, durationOverride]);

  useEffect(() => {
    if (!visible && show) {
      const timer = setTimeout(onClose, 300);
      return () => clearTimeout(timer);
    }
  }, [visible, show, onClose]);

  return (
    <div onClick={() => {}} className={`popup ${popupType === 'fail' ? 'fail' : popupType === 'success' ? 'success' : popupType === 'loading' ? 'loading' : 'message'}  ${visible ? 'fade-in' : 'fade-out'}`}>
      <div className="popup-content">
        {popupType === 'fail' ? 
            <PopupAlertIcon />
        : popupType === 'success' ?  
            <PopupSuccessIcon />
        : popupType === 'loading' ?
          <div className='spinner-wrapper'>
            <SpinnerIcon />
          </div>
        :
            <AttentionIcon />
        }
        <div className='popup-content-text'>
          <h1>{title}Saving Template...</h1>
          <p>{text}</p>
        </div>
      </div>
    </div>
  );
};
