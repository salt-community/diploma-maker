import { useCallback, useEffect, useState } from "react";
import './DraggableInput.css';

interface DraggableInputProps {
  value: number;
  setValue: (value: number) => void;
  label: string;
  minValue: number;
  disabled?: boolean;
}

const DraggableInput = ({ value, setValue, label, minValue, disabled = false }: DraggableInputProps) => {
  const [snapshot, setSnapshot] = useState<number>(value);
  const [startVal, setStartVal] = useState<number>(0);

  const onInputChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(ev.target.value);
      setValue(isNaN(newValue) ? 0 : parseFloat(newValue.toFixed(1)));
    },
    []
  );

  const onStart = useCallback(
    (event: React.MouseEvent<HTMLSpanElement>) => {
      setStartVal(event.clientX);
      setSnapshot(value);
    },
    [value]
  );

  useEffect(() => {
  const onUpdate = (event: MouseEvent) => {
    if (startVal) {
      const newValue = snapshot + (event.clientX - startVal) / 5;
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
}, [startVal, setValue, snapshot, minValue]);

  return (
    <div className={"draggable-input-container " + (disabled && 'disabled')}>
        <input
            value={disabled ? "-" : value}
            onChange={onInputChange}
            className={"draggable-input "  + (disabled && 'disabled')}
            onMouseDown={onStart}
        />
        <p>{label}</p>
    </div>
  );
};

export default DraggableInput;
