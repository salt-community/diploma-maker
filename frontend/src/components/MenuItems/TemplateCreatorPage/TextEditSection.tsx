import { ChangeEvent, useEffect, useState } from "react";
import DraggableInput from "../Inputs/DraggableInput";
import './TextEditSection.css'
import { SelectOptions } from "../Inputs/SelectOptions";
import { ChromePicker, PhotoshopPicker, SketchPicker } from "react-color";
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
  const [currentFont, setCurrentFont] = useState<string | null>(null);

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
      setFonts(font);
    })
  }, [])

  const handleFontChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFont(e.target.value);
    setCurrentFont(e.target.value);
  };

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
              ...Object.values(fonts || {}).map(font => ({
                value: font.label,
                label: font.label
              }))
            ]}
            value={font ?? ""}
            onChange={handleFontChange}
            disabled={align && fontSize && font && fontColor ? false : true}
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
      </div>
    </>
  );
};