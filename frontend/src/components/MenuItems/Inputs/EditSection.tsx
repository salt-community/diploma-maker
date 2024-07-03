import { useState } from "react";
import DraggableInput from "./DraggableInput";
import './EditSection.css'


type Props = {
  positionX: number,
  setPositionX: (value: number) => void,
  positionY: number,
  setPositionY: (value: number) => void,
  sizeWidth: number,
  setSizeWidth: (value: number) => void,
  sizeHeight: number,
  setSizeHeight: (value: number) => void,
}

export const EditSection = ({ positionX, setPositionX, positionY, setPositionY, sizeWidth, setSizeWidth, sizeHeight, setSizeHeight }: Props) => {
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(false);

  return (
    <>
      
      <form className="editlayout__container" action="">
        <div className="editlayout__menusection">
          <div className="editlayout__menusection--title"> 
            <label htmlFor="">Position</label>
          </div>
          <div className="editlayout__menusection--inputwrapper">
            <DraggableInput value={positionX} setValue={setPositionX} label="X"/>
            <DraggableInput value={positionY} setValue={setPositionY} label="Y"/>
          </div>
        </div>
        <div className="editlayout__menusection">
          <div className="editlayout__menusection--title">
            <label htmlFor="">Size</label>
            <svg onClick={() => setLockAspectRatio(!lockAspectRatio)} className={lockAspectRatio ? 'locked' : ''} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> 
              <path d="M14 7H16C18.7614 7 21 9.23858 21 12C21 14.7614 18.7614 17 16 17H14M10 7H8C5.23858 7 3 9.23858 3 12C3 14.7614 5.23858 17 8 17H10M8 12H16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g>
            </svg>
          </div>
          <div className="editlayout__menusection--inputwrapper">
            <DraggableInput value={sizeWidth} setValue={setSizeWidth} label="W"/>
            <DraggableInput value={sizeHeight} setValue={setSizeHeight} label="H"/>
          </div>
        </div>
      </form>
    </>
  );
};