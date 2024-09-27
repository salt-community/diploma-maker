import { FieldValues, UseFormRegister } from "react-hook-form";
import { utcFormatterSlash } from "../../../util/datesUtil";
import { BootcampRequest, BootcampResponse, TrackResponse } from "../../../util/types";
import { DeleteButtonSimple } from "../../MenuItems/Buttons/DeleteButtonSimple";
import { ArrowIcon } from "../../MenuItems/Icons/ArrowIcon";
import { SelectOptions } from "../../MenuItems/Inputs/SelectOptions";
import { PaginationMenu } from "../../MenuItems/PaginationMenu";
import { useEffect, useState } from "react";
import { PopupType } from "../../MenuItems/Popups/AlertPopup";
import { ConfirmationPopupType } from "../../MenuItems/Popups/ConfirmationPopup";
import { BootcampsSectionHeader } from "./BootcampsSectionHeader";


type SortOrder =
  'bootcampname-ascending' | 'bootcampname-descending' |
  'graduationdate-ascending' | 'graduationdate-descending' |
  'track-ascending' | 'track-descending';

type Props = {
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    sortingChanged: boolean;
    setSortingChanged: React.Dispatch<React.SetStateAction<boolean>>;
    tracks: TrackResponse[];
    bootcamps: BootcampResponse[];
    filteredBootcamps: BootcampResponse[] | null;
    setFilteredBootcamps: (value: React.SetStateAction<BootcampResponse[]>) => void;
    deleteBootcamp: (guidId: string) => Promise<void>;
    calendarPickers: React.MutableRefObject<any[]>;
    closeConfirmationPopup: () => void;
    customAlert: (alertType: PopupType, title: string, content: string) => void;
    customPopup: (type: ConfirmationPopupType, title: string, content: React.ReactNode, handler: () => void) => void

    register: UseFormRegister<FieldValues>;
    setValue: (name: string, value: any, options?: Partial<{
        shouldValidate: boolean;
        shouldDirty: boolean;
        shouldTouch: boolean;
    }>) => void;
    watch: (name: string, defaultValue?: any) => any;
    reset: (values?: FieldValues | {
        [x: string]: any;
    } | undefined, keepStateOptions?: Partial<{
        keepDirty: boolean;
        keepTouched: boolean;
        keepErrors: boolean;
        keepValues: boolean;
        keepDefaultValues: boolean;
        keepIsSubmitted: boolean;
        keepSubmitCount: boolean;
        keepDirtyValues: boolean;
        keepIsValid: boolean;
    }>) => void;
}

export const BootcampsTable = ( { 
    currentPage,
    setCurrentPage,
    sortingChanged,
    setSortingChanged,
    tracks,
    bootcamps, 
    filteredBootcamps, 
    setFilteredBootcamps,
    deleteBootcamp,
    calendarPickers,
    closeConfirmationPopup,
    customAlert,
    customPopup,
    register,
    setValue,
    watch,
    reset
}: Props) => {
    const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth < 1920 ? 5 : 11);
    const [sortOrder, setSortOrder] = useState<SortOrder>('graduationdate-descending');

    useEffect(() => {
        const handleResize = () => {
          setItemsPerPage(window.innerWidth < 1920 ? 5 : 11);
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
    }, []);

    const totalPages = Math.ceil((filteredBootcamps?.length || 0) / itemsPerPage);

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
        setSortingChanged(prev => !prev);
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
        setSortingChanged(prev => !prev);
    };

    const sortedBootcamps = filteredBootcamps?.sort((a, b) => {
        switch (sortOrder) {
            case 'bootcampname-ascending':
            return a.name.localeCompare(b.name);
            case 'bootcampname-descending':
            return b.name.localeCompare(a.name);
            case 'graduationdate-ascending':
            return new Date(a.graduationDate).getTime() - new Date(b.graduationDate).getTime();
            case 'graduationdate-descending':
            return new Date(b.graduationDate).getTime() - new Date(a.graduationDate).getTime();
            case 'track-ascending':
            return a.track?.name.localeCompare(b.track?.name);
            case 'track-descending':
            return b.track?.name.localeCompare(a.track?.name);
            default:
            return 0;
        }
    });    

    const handleSortChange = (sortType: SortOrder) => {
        setSortOrder(prevOrder => {
            if (prevOrder.startsWith(sortType.split('-')[0])) {
            return prevOrder === sortType ? `${sortType.split('-')[0]}-ascending` as SortOrder : sortType;
            } else {
            return sortType;
            }
        });
        setSortingChanged(prev => !prev);
    };

    const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTrackId = e.target.value;
        setCurrentPage(1);
        if (selectedTrackId === "") {
            setFilteredBootcamps(bootcamps);
        } else {
            setFilteredBootcamps(bootcamps?.filter(b => b.track.id.toString() === selectedTrackId) || null);
        }
        setSortingChanged(prev => !prev);
    };

    const paginatedBootcamps = sortedBootcamps?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        if (paginatedBootcamps) {
          const formValues = paginatedBootcamps.reduce((acc, bootcamp, index) => {
            const actualIndex = (currentPage - 1) * itemsPerPage + index;
            acc[`name${actualIndex}`] = bootcamp.name;
            acc[`dategraduate${actualIndex}`] = utcFormatterSlash(bootcamp.graduationDate);
            acc[`track${actualIndex}`] = bootcamp.track.id.toString();
            return acc;
          }, {});
          reset(formValues);
        }
    }, [sortingChanged, filteredBootcamps]);
    
    const handleDeleteBootcamp = async (guidId: string) => {
        closeConfirmationPopup();
        customAlert('loading', "Deleting Bootcamp...", ``);
        await deleteBootcamp(guidId);
        customAlert('message', "Delete Successful", `Successfully removed bootcamp from database.`);
        setSortingChanged(prev => !prev);
    }

    const confirmDeleteBootcampHandler = async (guidId: string) => customPopup('warning2', "Warning", <>By deleting this, you will lose <b style={{ color: '#EF4444' }}>ALL OF THE DIPLOMAS</b> associated with this bootcamp. This action cannot be undone.</>, () => () => handleDeleteBootcamp(guidId));
    
    return (
    <>
        <BootcampsSectionHeader 
            bootcamps={bootcamps}
            title={'Bootcamps'}
            handleTrackChange={handleTrackChange}
        />
        <div className="modal-main">
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
                                {...register(`name${actualIndex}`, { required: true })}
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
                                {...register(`track${actualIndex}`, { required: true })}
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
                            <DeleteButtonSimple onClick={() => confirmDeleteBootcampHandler(bootcamp.guidId)} />
                        </td>
                        </tr>
                    )
                    })}
                </tbody>
            </table>
        </div>
        {bootcamps && bootcamps.length > itemsPerPage && (
            <PaginationMenu
                containerClassOverride='modal-main-footer--pagination'
                buttonClassOverride='pagination-button'
                textContainerClassOverride='pagination-info'
                currentPage={currentPage}
                totalPages={totalPages}
                handleNextPage={handleNextPage}
                handlePrevPage={handlePrevPage}
            />
        )}
    </>
  );
};