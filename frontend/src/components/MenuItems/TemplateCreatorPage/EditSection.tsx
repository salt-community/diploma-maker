import { useEffect, useState } from "react";
import DraggableInput from "../Inputs/DraggableInput";
import './EditSection.css'
import { HorizontalAlignIcon } from "../Icons/HorizontalAlignIcon";
import { VerticalAlignIcon } from "../Icons/VerticalAlignIcon";

type Props = {
  positionX: number | null,
  setPositionX: (value: number) => void,
  positionY: number | null,
  setPositionY: (value: number) => void,
  sizeWidth: number | null,
  setSizeWidth: (value: number) => void,
  sizeHeight: number | null,
  setSizeHeight: (value: number) => void,
  setAlignHorizontalCenter: () => void,
  setAlignVerticalCenter: () => void,
  fieldWidth: number | null,
  fieldHeight: number | null
}

export const EditSection = ({ positionX, setPositionX, positionY, setPositionY, sizeWidth, setSizeWidth, sizeHeight, setSizeHeight, setAlignHorizontalCenter, setAlignVerticalCenter, fieldWidth, fieldHeight}: Props) => {
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(false);
  const [selectedButtons, setSelectedButtons] = useState<{ horizontal: boolean, vertical: boolean }>({ horizontal: false, vertical: false });

  const centerPositionX = (215 - (fieldWidth ?? 0)) / 2;
  const centerPositionY = (305 - (fieldHeight ?? 0)) / 2;

  useEffect(() => {
    setSelectedButtons(prev => ({
      ...prev,
      horizontal: positionX === centerPositionX,
      vertical: positionY === centerPositionY,
    }));
  }, [positionX, positionY, centerPositionX, centerPositionY]);

  const handleAlignHorizontalCenter = () => {
    setAlignHorizontalCenter();
    setSelectedButtons(prev => ({ ...prev, horizontal: !prev.horizontal }));
  };

  const handleAlignVerticalCenter = () => {
    setAlignVerticalCenter();
    setSelectedButtons(prev => ({ ...prev, vertical: !prev.vertical }));
  };
  

  const handleSizeWidthChange = (value: number) => {
    if (lockAspectRatio && sizeWidth && sizeHeight) {
      const aspectRatio = sizeWidth / sizeHeight;
      const newHeight = value / aspectRatio;
      setSizeWidth(value);
      setSizeHeight(newHeight);
    } else {
      setSizeWidth(value);
    }
  };
  
  const handleSizeHeightChange = (value: number) => {
    if (lockAspectRatio && sizeWidth && sizeHeight) {
      const aspectRatio = sizeWidth / sizeHeight;
      const newWidth = value * aspectRatio;
      setSizeHeight(value);
      setSizeWidth(newWidth);
    } else {
      setSizeHeight(value);
    }
  };

  return (
    <>
      <div className="editlayout__container">
        <div className="editlayout__menusection">
          <div className="editlayout__menusection--title"> 
            <label htmlFor="">Position</label>
          </div>
          <div className="editlayout__menusection--inputwrapper">
            <DraggableInput value={positionX ?? 0} setValue={setPositionX} label="X" minValue={0} disabled={positionX && positionY && sizeWidth && sizeHeight ? false : true}/>
            <DraggableInput value={positionY ?? 0} setValue={setPositionY} label="Y" minValue={0} disabled={positionX && positionY && sizeWidth && sizeHeight ? false : true}/>
          </div>
        </div>
        <div className="editlayout__menusection">
          <div className="editlayout__menusection--title">
            <label htmlFor="">Size</label>
            <svg onClick={() => setLockAspectRatio(!lockAspectRatio)} className={lockAspectRatio ? 'locked' : ''} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> 
              <path d="M14 7H16C18.7614 7 21 9.23858 21 12C21 14.7614 18.7614 17 16 17H14M10 7H8C5.23858 7 3 9.23858 3 12C3 14.7614 5.23858 17 8 17H10M8 12H16" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g>
            </svg>
          </div>
          <div className="editlayout__menusection--inputwrapper">
            <DraggableInput value={sizeWidth ?? 0} setValue={handleSizeWidthChange} label="W" minValue={0} disabled={positionX && positionY && sizeWidth && sizeHeight ? false : true}/>
            <DraggableInput value={sizeHeight ?? 0} setValue={handleSizeHeightChange} label="H" minValue={0} disabled={positionX && positionY && sizeWidth && sizeHeight ? false : true}/>
          </div>
        </div>
        <div className="editlayout__menusection">
          <div className="editlayout__menusection--title">
            <label htmlFor="">Align</label>
          </div>
          <div className={"editlayout__menusection--inputwrapper btnmenu " + (!positionX && !positionY && !sizeWidth && !sizeHeight && 'disabled')}>
            <button onClick={handleAlignHorizontalCenter} className={'editlayout__menusection--btn ' + (selectedButtons.horizontal ? 'selected' : '')}>
              <VerticalAlignIcon />
            </button>
            <button onClick={handleAlignVerticalCenter} className={'editlayout__menusection--btn ' + (selectedButtons.vertical ? 'selected' : '')}>
              <HorizontalAlignIcon />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};