import { ChangeEvent, useEffect, useRef, useState } from "react";
import './TextEditSection.css'
import { SelectOptions } from "../Inputs/SelectOptions";
import { PhotoshopPicker } from "react-color";
import { getFontsData } from "../../../util/helper";
import { Fonts } from "../../../util/types";
import { SelectableInput } from "../Inputs/SelectableInput";
import { TextAlignLeftIcon } from "../Icons/TextAlignLeftIcon";
import { TextAlignCenterIcon } from "../Icons/TextAlignCenterIcon";
import { TextAlignRightIcon } from "../Icons/TextAlignRightIcon";
import { TextAlignNormalIcon } from "../Icons/TextAlignNormalIcon";


type Props = {
  align: string | null,
  setAlign: (value: string) => void,
  fontSize: number | null,
  setFontSize: (value: number) => void,
  font: string | null,
  setFont: (value: string) => void,
  fontColor: string | null,
  setFontColor: (value: string) => void,
}

export const TextEditSection = ({align, setAlign, fontSize, setFontSize, font, setFont, fontColor, setFontColor}: Props) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [colorPickerColor, setColorPickerColor] = useState<string>("#fff");
  const [fonts, setFonts] = useState<Fonts | null>();
  const [fontStyle, setFontStyle] = useState<string>("normal");
  //@ts-ignore
  const [currentFont, setCurrentFont] = useState<string | null>(null);
  const fontSelector = useRef(null)

  const handleColorClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const colorpickerCancelHandler = () => {
    setDisplayColorPicker(false);
  };

  const colorPickerColorChangeHandler = (color: any) => {
    setColorPickerColor(color.hex);
  };

  const colorPickerApplyHandler = () => {
    setFontColor(colorPickerColor);
    setDisplayColorPicker(false);
  }

  useEffect(() => {
    setCurrentFont(font);
    getFontsData().then((font) => {
      //@ts-ignore
      setFonts(font);
    })
  }, [])

  useEffect(() => {
    if(font){
      font.toLowerCase().includes('-bold') ? setFontStyle("bold") :
      font.toLowerCase().includes('-italic') ? setFontStyle("italic")
      : setFontStyle("normal");
    }
  }, [font])

  const handleFontChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFont(e.target.value);
    setCurrentFont(e.target.value);
  };

  const toggleBold = () => {
    if(fontStyle != "bold"){
      setFont(`${fontSelector.current.value}-bold`)
    } else{
      setFont(`${fontSelector.current.value}`)
    }
  }

  const toggleItalic = () => {
    if(fontStyle != "italic"){
      setFont(`${fontSelector.current.value}-italic`)
    } else{
      setFont(`${fontSelector.current.value}`)
    }
  }

  return (
    <>
      <div className="edittext__container">
        <div className="edittext__menusection">
          <div className="edittext__menusection--title">
            <label htmlFor="">Align</label>
          </div>
          <div className={"edittext__menusection--inputwrapper " + (!align && !fontSize && !font && !fontColor && ' disabled')}>
            <button onClick={() => setAlign("left")} className={'edittext__menusection--btn ' + (align === "left" && 'selected')}>
              <TextAlignLeftIcon />
            </button>
            <button onClick={() => setAlign("center")} className={'edittext__menusection--btn ' + (align === "center" && 'selected')}>
              <TextAlignCenterIcon />
            </button>
            <button onClick={() => setAlign("right")} className={'edittext__menusection--btn ' + (align === "right" && 'selected')}>
              <TextAlignRightIcon />
            </button>
            <button onClick={() => setAlign("normal")} className={'edittext__menusection--btn ' + (align === "normal" && 'selected')}>
              <TextAlignNormalIcon />
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
            options={[
              ...Object.values(fonts || {})
              .filter(font => !font.label.toLowerCase().includes('-bold') && !font.label.toLowerCase().includes('-italic'))
              .map(font => ({
                value: font.label,
                label: font.label
              }))
              .sort((a, b) => a.label.localeCompare(b.label))
            ]}
            value={font ? font.replace(/-bold|-italic/i, '') : ""}
            onChange={handleFontChange}
            disabled={align && fontSize && font && fontColor ? false : true}
            ref={fontSelector}
          />
          </div>
        </div>
        <div className="edittext__menusection">
          <div className="edittext__menusection--title">
            <label htmlFor="">Size</label>
          </div>
          <div className="edittext__menusection--inputwrapper">
            <SelectableInput value={fontSize ?? 0} setValue={setFontSize} label="px" minValue={1} disabled={align && fontSize && font && fontColor ? false : true}/>
          </div>
        </div>
        <div className="edittext__menusection">
          <div className="edittext__menusection--title">
            <label htmlFor="">Color</label>
          </div>
          <div className="edittext__menusection--inputwrapper">
            <div 
              className={"color-picker__swatch " + (!align && !fontSize && !font && !fontColor && 'disabled')}
              style={{ backgroundColor: fontColor ?? "#000" }} 
              onClick={handleColorClick}
            />
            {displayColorPicker ? 
              <div className="color-picker__popover">
                  <PhotoshopPicker color={colorPickerColor} onChange={colorPickerColorChangeHandler} onAccept={colorPickerApplyHandler} onCancel={colorpickerCancelHandler}/>
              </div> 
              : null
            }
          </div>
        </div>
          <div className="edittext__menusection">
            <div className="edittext__menusection--title">
              <label htmlFor="">Style</label>
            </div>
            <div className={"edittext__menusection--inputwrapper " + (!align && !fontSize && !font && !fontColor && ' disabled')}>
                <button onClick={() => {fontStyle === "bold" ? setFontStyle("normal") : setFontStyle("bold"); toggleBold();}} className={'edittext__menusection--btn ' + (fontStyle === "bold" && 'selected')}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Edit / Bold"> 
                    <path id="Vector" d="M8 12H12.5M8 12V5H12.5C14.433 5 16 6.567 16 8.5C16 10.433 14.433 12 12.5 12M8 12V19H13.5C15.433 19 17 17.433 17 15.5C17 13.567 15.433 12 13.5 12H12.5" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g> </g>
                  </svg>
                </button>
                <button onClick={() => {fontStyle === "italic" ? setFontStyle("normal") : setFontStyle("italic"); toggleItalic();}} className={'edittext__menusection--btn ' + (fontStyle === "italic" && 'selected')}>
                  <svg className="tweaksvg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier">
                    <path d="M10 3H20M4 21H14M15 3L9 21" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g>
                  </svg>
                </button>
                {/* <button onClick={() => {fontStyle === "underline" ? setFontStyle("normal") : setFontStyle("underline");}} className={'edittext__menusection--btn ' + (fontStyle === "underline" && 'selected')}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> 
                    <path d="M4 21H20M18 4V11C18 14.3137 15.3137 17 12 17C8.68629 17 6 14.3137 6 11V4M4 3H8M16 3H20" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g>
                  </svg>
                </button> */}
            </div>
          </div>
      </div>
    </>
  );
};