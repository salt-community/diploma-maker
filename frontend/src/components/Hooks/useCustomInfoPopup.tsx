import { useState, useEffect } from 'react';
import { InfoPopupType } from '../MenuItems/Popups/InfoPopup';

export const useCustomInfoPopup = () => {
  const [showInfoPopup, setShowInfoPopup] = useState<boolean>(false);
  const [infoPopupContent, setInfoPopupContent] = useState<string[]>(["",""]);
  const [infoPopupType, setInfoPopupType] = useState<InfoPopupType>('form');
  const [infoPopupHandler, setInfoPopupHandler] = useState<() => void>(() => {});

  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState<boolean>(false);

  useEffect(() => {
    if (progress >= 99) {
      setFinished(true);
    }
  }, [progress]);

  const customInfoPopup = (type: InfoPopupType, title: string, content: string, handler: () => ((inputContent?: string) => void) | (() => void)) => {
    setInfoPopupType(type);
    setInfoPopupContent([title, content]);
    setInfoPopupHandler(handler);
    setShowInfoPopup(true);
  }

  const closeInfoPopup = () => {
    setShowInfoPopup(false);
    setTimeout(() => {
      setFinished(false);
      setProgress(0);
    }, 750);
  }

  return { showInfoPopup, infoPopupContent, infoPopupType, infoPopupHandler, customInfoPopup, closeInfoPopup, progress, setProgress, finished }
}
