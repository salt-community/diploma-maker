import './ExclusiveCheckBoxGroup.css';

type Item = {
  label: string;
  validationOptions?: any;
};

type Props = {
  items: Item[];
  defaultChecked?: number;
  legend?: string;
  scope: string;
};

export const ExclusiveCheckBoxGroup = ({ items, legend, scope, defaultChecked = 0 }: Props) => {
  return (
    <fieldset className="exclusivecheckbox-group">
      {legend && <legend className="exclusivecheckbox-group-legend">{legend}</legend>}
      {items.map((item, index) => (
        <label className="exclusivecheckbox-label" style={{maxWidth: `250px`}} key={index}>
          <input
            type="radio"
            name={scope}
            id={`exclusivecheckbox-${index}`}
            className="exclusivecheckbox-input"
            defaultChecked={index === defaultChecked}
            {...item.validationOptions}
          />
          <span className="exclusivecheckbox-text">{item.label}</span>
        </label>
      ))}
    </fieldset>
  );
};