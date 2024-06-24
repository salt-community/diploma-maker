import { useState, useEffect } from 'react';
import './AlertPopup.css';
import { PopupAlertIcon } from '../Icons/PopupAlertIcon';
import { PopupSuccessIcon } from '../Icons/PopupSuccessIcon';

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
            <PopupAlertIcon />
          :
            <PopupSuccessIcon />
        }
        <div className='popup-content-text'>
          <h1>{title}</h1>
          <p>{text}</p>
        </div>
      </div>
    </div>
  );
};
