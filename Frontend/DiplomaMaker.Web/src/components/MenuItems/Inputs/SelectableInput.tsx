import { useCallback, useEffect, useState } from "react";
import './SelectableInput.css';
import { NextIcon } from "../Icons/NextIcon";

interface DraggableInputProps {
  value: number;
  setValue: (value: number) => void;
  label: string;
  minValue: number;
  disabled?: boolean;
}

export const SelectableInput = ({ value, setValue, label, minValue, disabled = false }: DraggableInputProps) => {
  const [inputValue, setInputValue] = useState<number>(value);
  const [startVal, setStartVal] = useState<number>(0);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const onInputChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(ev.target.value);
      setInputValue(isNaN(newValue) ? 0 : parseFloat(newValue.toFixed(1)));
    },
    []
  );

  const onInputBlur = useCallback(
    (ev: React.KeyboardEvent<HTMLInputElement>) => {
      if (ev.key === 'Enter') {
        setValue(inputValue);
      }
    },
    [inputValue, setValue]
  );

  useEffect(() => {
    const onUpdate = (event: MouseEvent) => {
      if (startVal) {
        const newValue = inputValue + (event.clientX - startVal) / 5;
        setValue(Math.max(minValue, parseFloat(newValue.toFixed(1))));
      }
    };

    const onEnd = () => {
      setStartVal(0);
    };

    document.addEventListener("mousemove", onUpdate);
    document.addEventListener("mouseup", onEnd);
    return () => {
      document.removeEventListener("mousemove", onUpdate);
      document.removeEventListener("mouseup", onEnd);
    };
  }, [startVal, setValue, inputValue, minValue]);

  const onSelectChange = useCallback(
    (ev: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = parseFloat(ev.target.value);
      setInputValue(newValue);
      setValue(newValue);
    },
    [setValue]
  );
  

  return (
    <div className={"selectable-input-container " + (disabled && 'disabled')}>
        <input
            value={disabled ? "-" : inputValue}
            onChange={onInputChange}
            onKeyDown={onInputBlur}
            className={"selectable-input "  + (disabled && 'disabled')}
        />
        <select className="selectable-input--selection" onChange={onSelectChange}>
          <option value="10">10</option>
          <option value="10">11</option>
          <option value="12">12</option>
          <option value="10">13</option>
          <option value="14">14</option>
          <option value="14">15</option>
          <option value="16">16</option>
          <option value="20">20</option>
          <option value="22">22</option>
          <option value="24">24</option>
          <option value="32">32</option>
          <option value="36">36</option>
          <option value="40">40</option>
          <option value="48">48</option>
          <option value="64">64</option>
          <option value="96">96</option>
        </select>
        <p>{label}</p>
        <div className="dropdown-arrow-wrapper">
          <NextIcon rotation={-90}/>
        </div>
    </div>
  );
};