import { useState } from "react";
import DraggableInput from "./DraggableInput";
import './EditSection.css'

export const EditSection = () => {
  const [position1, setPosition1] = useState<number>(5);
  const [position2, setPosition2] = useState<number>(5);
  const [size1, setSize1] = useState<number>(5);
  const [size2, setSize2] = useState<number>(5);

  return (
    <form className="editlayout__container" action="">
      <div className="editlayout__menusection">
        <label htmlFor="">Position</label>
        <DraggableInput value={position1} setValue={setPosition1} label="X"/>
        <DraggableInput value={position2} setValue={setPosition2} label="Y"/>
      </div>
      <div className="editlayout__menusection">
        <label htmlFor="">Size</label>
        <DraggableInput value={size1} setValue={setSize1} label="W"/>
        <DraggableInput value={size2} setValue={setSize2} label="H"/>
      </div>
    </form>
  );
};