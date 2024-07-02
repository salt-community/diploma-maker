import { useCallback, useEffect, useState } from "react";
import './DraggableInput.css';

interface DraggableInputProps {
  value: number;
  setValue: (value: number) => void;
  label: string;
}

const DraggableInput = ({ value, setValue, label }: DraggableInputProps) => {
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
        setValue(snapshot + Math.floor((event.clientX - startVal) / 5));
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
  }, [startVal, setValue, snapshot]);

  return (
    <div className="draggable-input-container">
        <input
            value={value}
            onChange={onInputChange}
            className="draggable-input"
            onMouseDown={onStart}
        />
        <label htmlFor="">{label}</label>
    </div>
  );
};

export default DraggableInput;
