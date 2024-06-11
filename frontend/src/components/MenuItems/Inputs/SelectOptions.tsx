import './SelectOptions.css'

type Option = {
    value: string
    label: string
};

type Props = {
    containerClassOverride?: string,
    selectClassOverride?: string,
    options: Option[]
};

export const SelectOptions = ({ options, containerClassOverride, selectClassOverride }: Props) => {
    return (
        <div className={"select-wrapper " + containerClassOverride}>
            <select className={selectClassOverride}>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};