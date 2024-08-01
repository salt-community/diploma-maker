import './CheckBoxGroup.css';

type Item = {
  icon: JSX.Element;
  label: string;
  validationOptions?: any;
};

type Props = {
  items: Item[];
  defaultChecked: number[];
  legend?: string;
  widthpx?: number;
};

export const CheckboxGroup = ({ items, defaultChecked, legend, widthpx = 300 }: Props) => {
  return (
    <fieldset className="checkbox-group">
      {legend && <legend className="checkbox-group-legend">{legend}</legend>}
      {items.map((item, index) => (
        <div className="checkbox" style={{minWidth: `${widthpx}px`}} key={index}>
          <label className="checkbox-wrapper">
            <input 
              type="checkbox" 
              className="checkbox-input" 
              defaultChecked={defaultChecked.includes(index)} 
              {...item.validationOptions} 
            />
            <span className="checkbox-tile">
              <span className="checkbox-icon">{item.icon}</span>
              <span className="checkbox-label">{item.label}</span>
            </span>
          </label>
        </div>
      ))}
    </fieldset>
  );
};