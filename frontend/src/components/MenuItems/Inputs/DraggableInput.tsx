import { useCallback, useEffect, useState } from "react";
import './DraggableInput.css';

interface DraggableInputProps {
  value: number;
  setValue: (value: number) => void;
  label: string;
  minValue: number;
}

const DraggableInput = ({ value, setValue, label, minValue }: DraggableInputProps) => {
  const [snapshot, setSnapshot] = useState<number>(value);
  const [startVal, setStartVal] = useState<number>(0);

  const onInputChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => setValue(parseInt(ev.target.value, 10)),
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
        setValue(Math.max(minValue, snapshot + Math.floor((event.clientX - startVal) / 5)));
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
    <div className="draggable-input-container">
        <input
            value={value}
            onChange={onInputChange}
            className="draggable-input"
            onMouseDown={onStart}
        />
        <p>{label}</p>
    </div>
  );
};

export default DraggableInput;
