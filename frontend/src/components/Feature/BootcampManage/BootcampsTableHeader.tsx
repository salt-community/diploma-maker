import { BootcampResponse } from "../../../util/types";
import { SelectOptions } from "../../MenuItems/Inputs/SelectOptions";

type Props = {
    bootcamps: BootcampResponse[];
    title: string;
    handleTrackChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const BootcampsTableHeader = (  { bootcamps, title, handleTrackChange }: Props) => {
  return (
    <div className="modal-header">
        <h3 className="modal-title">{title}</h3>
        <SelectOptions
            containerClassOverride='overview-page__select-container'
            selectClassOverride='overview-page__select-box'
            options={[
                { value: "", label: "All Tracks" },
                ...(bootcamps?.flatMap(bootcamp => bootcamp.track).filter((value, index, self) => 
                    index === self.findIndex((t) => (
                        t.id === value.id
                    ))
                ).map(track => ({
                    value: track.id.toString(),
                    label: track.name
                })) || [])
            ]}
            onChange={handleTrackChange}
        />
    </div>
  );
};