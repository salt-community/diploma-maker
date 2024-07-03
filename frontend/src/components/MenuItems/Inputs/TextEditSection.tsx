import { useState } from "react";
import DraggableInput from "./DraggableInput";
import './TextEditSection.css'
import { SelectOptions } from "./SelectOptions";


type Props = {
  align: string,
  setAlign: (value: string) => void,
  fontSize: number,
  setFontSize: (value: number) => void,
}

export const TextEditSection = ({align, setAlign, fontSize, setFontSize}: Props) => {

  return (
    <>
      <div className="edittext__container">
        <div className="edittext__menusection">
          <div className="edittext__menusection--title">
            <label htmlFor="">Align</label>
          </div>
          <div className="edittext__menusection--inputwrapper">
            <button onClick={() => setAlign("left")} className={'edittext__menusection--btn ' + (align === "left" && 'selected')}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> 
                <path d="M3 10H16M3 14H21M3 18H16M3 6H21" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g>
              </svg>
            </button>
            <button onClick={() => setAlign("center")} className={'edittext__menusection--btn ' + (align === "center" && 'selected')}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> 
                <path d="M3 6H21M3 14H21M17 10H7M17 18H7" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g>
              </svg>
            </button>
            <button onClick={() => setAlign("right")} className={'edittext__menusection--btn ' + (align === "right" && 'selected')}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> 
                <path d="M3 8H21M3 12H21M3 20H21M10 16H21M10 4H21" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g>
              </svg>
            </button>
            <button onClick={() => setAlign("normal")} className={'edittext__menusection--btn ' + (align === "normal" && 'selected')}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> 
                <path d="M3 8H21M3 12H21M3 16H21M3 20H15M3 4H21" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g>
              </svg>
            </button>
          </div>
        </div>
        <div className="edittext__menusection">
          <div className="edittext__menusection--title"> 
            <label htmlFor="">Font</label>
          </div>
          <div className="edittext__menusection--inputwrapper">
          <SelectOptions
                  containerClassOverride='overview-page__select-container'
                  selectClassOverride='overview-page__select-box'
                  options={[{
                    value: "NotoSerifJP-Regular",
                    label: "NotoSerifJP-Regular"
                  }]}
                  onChange={() => {}}
            />
          </div>
        </div>
        <div className="edittext__menusection">
          <div className="edittext__menusection--title">
            <label htmlFor="">Size</label>
          </div>
          <div className="edittext__menusection--inputwrapper">
            <DraggableInput value={fontSize} setValue={setFontSize} label="px" minValue={1}/>
          </div>
        </div>
        <div className="edittext__menusection">
          <div className="edittext__menusection--title">
            <label htmlFor="">Color</label>
          </div>
          <div className="edittext__menusection--inputwrapper">
            
          </div>
        </div>
      </div>
    </>
  );
};