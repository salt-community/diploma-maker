import { useState } from "react";
import DraggableInput from "../Inputs/DraggableInput";
import './EditSection.css'

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
  setAlignVerticalCenter: () => void
}

export const EditSection = ({ positionX, setPositionX, positionY, setPositionY, sizeWidth, setSizeWidth, sizeHeight, setSizeHeight, setAlignHorizontalCenter, setAlignVerticalCenter}: Props) => {
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(false);

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
            <svg onClick={() => setLockAspectRatio(!lockAspectRatio)} className={lockAspectRatio ? 'locked' : ''} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> 
              <path d="M14 7H16C18.7614 7 21 9.23858 21 12C21 14.7614 18.7614 17 16 17H14M10 7H8C5.23858 7 3 9.23858 3 12C3 14.7614 5.23858 17 8 17H10M8 12H16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g>
            </svg>
          </div>
          <div className="editlayout__menusection--inputwrapper">
            <DraggableInput value={sizeWidth ?? 0} setValue={setSizeWidth} label="W" minValue={0} disabled={positionX && positionY && sizeWidth && sizeHeight ? false : true}/>
            <DraggableInput value={sizeHeight ?? 0} setValue={setSizeHeight} label="H" minValue={0} disabled={positionX && positionY && sizeWidth && sizeHeight ? false : true}/>
          </div>
        </div>
        <div className="editlayout__menusection">
          <div className="editlayout__menusection--title">
            <label htmlFor="">Align</label>
          </div>
          <div className={"editlayout__menusection--inputwrapper btnmenu " + (!positionX && !positionY && !sizeWidth && !sizeHeight && 'disabled')}>
            <button onClick={() => setAlignHorizontalCenter()} className={'editlayout__menusection--btn '}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> 
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C12.5523 3 13 3.44772 13 4V5H17C18.6569 5 20 6.34315 20 8C20 9.65685 18.6569 11 17 11H13V13H14C15.6569 13 17 14.3431 17 16C17 17.6569 15.6569 19 14 19H13V20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20V19H10C8.34315 19 7 17.6569 7 16C7 14.3431 8.34315 13 10 13H11V11H7C5.34315 11 4 9.65685 4 8C4 6.34315 5.34315 5 7 5H11V4C11 3.44772 11.4477 3 12 3ZM7 7C6.44772 7 6 7.44772 6 8C6 8.55228 6.44772 9 7 9H12H17C17.5523 9 18 8.55228 18 8C18 7.44772 17.5523 7 17 7H12H7ZM10 15C9.44772 15 9 15.4477 9 16C9 16.5523 9.44772 17 10 17H12H14C14.5523 17 15 16.5523 15 16C15 15.4477 14.5523 15 14 15H12H10Z" fill="#000000"></path> </g>
              </svg>
            </button>
            <button onClick={() => setAlignVerticalCenter()} className={'editlayout__menusection--btn '}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> 
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5 7C5 5.34315 6.34315 4 8 4C9.65685 4 11 5.34315 11 7V11H13V10C13 8.34315 14.3431 7 16 7C17.6569 7 19 8.34315 19 10V11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H19V14C19 15.6569 17.6569 17 16 17C14.3431 17 13 15.6569 13 14V13H11V17C11 18.6569 9.65685 20 8 20C6.34315 20 5 18.6569 5 17V13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11H5V7ZM8 6C7.44772 6 7 6.44772 7 7V12V17C7 17.5523 7.44772 18 8 18C8.55228 18 9 17.5523 9 17V12V7C9 6.44772 8.55228 6 8 6ZM16 9C15.4477 9 15 9.44772 15 10V12V14C15 14.5523 15.4477 15 16 15C16.5523 15 17 14.5523 17 14V12V10C17 9.44772 16.5523 9 16 9Z" fill="#000000"></path> </g>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};