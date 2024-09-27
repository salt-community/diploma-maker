import { useState, useEffect } from 'react';
import './AlertPopup.css';
import { PopupAlertIcon } from '../Icons/PopupAlertIcon';
import { PopupSuccessIcon } from '../Icons/PopupSuccessIcon';
import { AttentionIcon } from '../Icons/AttentionIcon';
import { SpinnerIcon } from '../Icons/SpinnerIcon';
export type PopupType = 'success' | 'fail' | 'message' | 'loading' | 'loadingfadeout'
type Props = {
  title: string;
  text: string;
  show: boolean;
  onClose: () => void;
  popupType: PopupType;
  durationOverride?: number;
  leftAligned?: boolean;
}

export type CustomAlertPopupProps = {
  showPopup: Boolean;
  customAlert: (alertType: PopupType, title: string, content: string) => void;
  closeAlert: () => void;
};

export const AlertPopup = ({ show, onClose, popupType, title, text, durationOverride, leftAligned }: Props) => {
  const [visible, setVisible] = useState(show);
  useEffect(() => {
    let timer: any;
    let visibleTime = durationOverride ? durationOverride : 2500;
    if(popupType === 'loadingfadeout'){
      visibleTime = 750;
    }
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
    <div onClick={() => {}} className={`popup '
      ${popupType === 'fail' ? 'fail' 
        : popupType === 'success' ? 'success' 
        : popupType === 'message' ? 'message' : 'loading'}  
      ${visible ? 'fade-in' : 'fade-out'}
      ${leftAligned && ' alignleft'}
      `}>
          
      <div className="popup-content">
        {popupType === 'fail' ?
            <PopupAlertIcon />
        : popupType === 'success' ?
            <PopupSuccessIcon />
        : popupType === 'message' ?
          <AttentionIcon />
        :
          <div className='spinner-wrapper'>
            <SpinnerIcon />
          </div>
        }
        <div className='popup-content-text'>
          <h1>{title}</h1>
          <p>{text}</p>
        </div>
      </div>
    </div>
  );
};