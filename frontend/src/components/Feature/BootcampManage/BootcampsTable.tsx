import { FieldValues, UseFormRegister } from "react-hook-form";
import { utcFormatterSlash } from "../../../util/datesUtil";
import { BootcampResponse, TrackResponse } from "../../../util/types";
import { DeleteButtonSimple } from "../../MenuItems/Buttons/DeleteButtonSimple";
import { ArrowIcon } from "../../MenuItems/Icons/ArrowIcon";
import { SelectOptions } from "../../MenuItems/Inputs/SelectOptions";
import { SortOrder } from "../../../pages/BootcampManagement/BootcampManagement";

type Props = {
    tracks: TrackResponse[];
    paginatedBootcamps: BootcampResponse[];
    sortOrder: SortOrder;
    handleSortChange: (sortType: SortOrder) => void;
    confirmDeleteBootcampHandler: (index: number) => Promise<void>;
    currentPage: number;
    itemsPerPage: number;
    calendarPickers: React.MutableRefObject<any[]>;
    register: UseFormRegister<FieldValues>;
    setValue: (name: string, value: any, options?: Partial<{
        shouldValidate: boolean;
        shouldDirty: boolean;
        shouldTouch: boolean;
    }>) => void;
    watch: (name: string, defaultValue?: any) => any;
}

export const BootcampsTable = ( { 
    tracks,
    paginatedBootcamps, 
    sortOrder, 
    handleSortChange, 
    confirmDeleteBootcampHandler, 
    currentPage, 
    itemsPerPage, 
    calendarPickers,
    register,
    setValue,
    watch,
}: Props) => {
  return (
    <table className="table-auto">
        <thead>
        <tr>
            <th
                onClick={() => handleSortChange(sortOrder === 'bootcampname-descending' ? 'bootcampname-ascending' : 'bootcampname-descending')}
                className={'sortable-header ' + (sortOrder.includes('bootcampname') ? (sortOrder === 'bootcampname-descending' ? 'descending' : 'ascending') : '')}
            >
                Bootcamp Name 
                <div className={'icon-container ' + (!sortOrder.includes('bootcampname') ? 'hidden' : '')}>
                    <ArrowIcon rotation={sortOrder === 'bootcampname-descending' ? 180 : 0} />
                </div>
            </th>
            <th
                onClick={() => handleSortChange(sortOrder === 'graduationdate-descending' ? 'graduationdate-ascending' : 'graduationdate-descending')}
                className={'sortable-header ' + (sortOrder.includes('graduationdate') ? (sortOrder === 'graduationdate-descending' ? 'descending' : 'ascending') : '')}
            >
                Graduation Date 
                <div className={'icon-container ' + (!sortOrder.includes('graduationdate') ? 'hidden' : '')}>
                    <ArrowIcon rotation={sortOrder === 'graduationdate-descending' ? 180 : 0} />
                </div>
            </th>
            <th
                onClick={() => handleSortChange(sortOrder === 'track-descending' ? 'track-ascending' : 'track-descending')}
                className={'sortable-header ' + (sortOrder.includes('track') ? (sortOrder === 'track-descending' ? 'descending' : 'ascending') : '')}
            >
                Track 
                <div className={'icon-container ' + (!sortOrder.includes('track') ? 'hidden' : '')}>
                    <ArrowIcon rotation={sortOrder === 'track-descending' ? 180 : 0} />
                </div>
            </th>
            <th>

            </th>
        </tr>
        </thead>
        <tbody>
        {paginatedBootcamps &&
            paginatedBootcamps.map((bootcamp, index) => {
            const actualIndex = (currentPage - 1) * itemsPerPage + index;
            return (
                <tr className="table-row" key={`tablecell_${bootcamp.guidId}`}>
                <td className="table-cell">
                    <input
                        type="text"
                        {...register(`name${actualIndex}`)}
                        defaultValue={bootcamp.name}
                        className="date-input disabled"
                        disabled
                    />
                </td>
                <td className="table-cell">
                    <input
                        id={bootcamp.guidId + "1"}
                        {...register(`dategraduate${actualIndex}`, { required: true })}
                        type="date"
                        className="date-input"
                        defaultValue={utcFormatterSlash(bootcamp.graduationDate)}
                        key={`dategrad_${bootcamp.guidId}`}
                        ref={item => (calendarPickers.current[index] = item)}
                        onChange={(e) => setValue(`dategraduate${actualIndex}`, e.target.value)}
                    />
                </td>
                <td className="table-cell">
                    <SelectOptions
                        containerClassOverride='normal'
                        selectClassOverride='normal'
                        options={[
                            ...(tracks?.map(track => ({
                            value: track.id.toString(),
                            label: track.name
                            })) || [])
                        ]}
                        defaultValue={watch(`track${actualIndex}`, bootcamp.track.id.toString())}
                        {...register(`track${actualIndex}`)}
                        onChange={(e) => {
                            setValue(`track${actualIndex}`, e.target.value);
                            bootcamp.track.id = parseInt(e.target.value);
                        }}
                        reactHookForm={true}
                        register={register}
                        name={`track${actualIndex}`}
                    />
                </td>
                <td>
                    <DeleteButtonSimple onClick={() => confirmDeleteBootcampHandler(actualIndex)} />
                </td>
                </tr>
            )
            })}
        </tbody>
    </table>
  );
};