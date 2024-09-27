import { BootcampRequest, BootcampResponse, TrackResponse } from "../../util/types";
import { useEffect, useRef, useState } from "react";
import { AlertPopup, PopupType } from "../MenuItems/Popups/AlertPopup";
import { useCustomAlert } from "../Hooks/useCustomAlert";
import './AddNewBootcampForm.css'
import { SelectOptions } from "../MenuItems/Inputs/SelectOptions";
import { AddButtonSimple } from "../MenuItems/Buttons/AddButtonSimple";
import { CloseWindowIcon } from "../MenuItems/Icons/CloseWindowIcon";
import { delay } from "../../util/timeUtil";

type Props = {
    addNewBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
    bootcamps: BootcampResponse[] | null;
    tracks: TrackResponse[];
    enableClose?: boolean;
    onClick?: () => void;
}

export default function AddNewBootcampForm({ addNewBootcamp, bootcamps, tracks, enableClose = false, onClick}: Props) {
    const [name, setName] = useState<string>("");
    const [track, setTrack] = useState<TrackResponse | null>();
    const [gradDate, setGradDate] = useState<Date | null>(null);
    const dateInput  = useRef(null);

    const { showPopup, popupContent, popupType, customAlert, closeAlert } = useCustomAlert();

    useEffect(() => {
        if(tracks){
            setTrack(tracks[0])
        }
    }, [tracks])

    async function addBootcampHandler(){
        if (bootcamps!.some(bootcamp => bootcamp.name.toLowerCase() === name.toLowerCase())) {
            customAlert('fail', "Input Validation Error", "The name already exists");
            return;
        }
        if (!gradDate) {
            customAlert('fail', "Input Validation Error", "Must select a date!");
            return;
        }
        const trackid = track.name === "C# Dotnet" ? 1
              : track.name === "Java" ? 2
              : track.name === "Javascript" ? 3
              : undefined;
              
        const newBootcamp: BootcampRequest = {graduationDate: gradDate, trackId: trackid};
        try {
            await addNewBootcamp(newBootcamp);
            customAlert('success', "Successfully added!", "Successfully added new bootcamp to database");
            enableClose && onClick();
            
        } catch (err) {
            customAlert('fail', "Something Went Wrong!", `${err}`);
        } 
    }

    const calendarClickHandler = () => dateInput.current.showPicker();

    return (
        <div className="modal-main-footer">
            <div className="content-container">
                {enableClose &&
                    <button onClick={onClick} className="newbootcamp-close-btn">
                        <CloseWindowIcon />
                    </button>
                }
                <AlertPopup title={popupContent[0]} text={popupContent[1]} popupType={popupType} show={showPopup} onClose={closeAlert}/>
                <br />
                <table className="auto-table">
                    <div className="newbootcamp-title-container">
                        <h1 className="newbootcamp-title">Add Bootcamp</h1>
                    </div>
                    <tbody>
                        <tr>
                            <th className="date-header">Graduation Date</th>
                            <th className="date-header">Track</th>
                            <th className="date-header"></th>
                            <th className="date-header"></th>
                        </tr>
                        <tr>
                            <td className="date-cell">
                                <input 
                                    type="date" 
                                    onClick={calendarClickHandler}
                                    onChange={event => setGradDate(new Date(event.target.value))} 
                                    className="date-input"
                                    ref={dateInput}
                                />
                            </td>
                            <td className="date-cell">
                                {tracks && 
                                    <SelectOptions
                                        containerClassOverride='normal'
                                        selectClassOverride='normal'
                                        options={tracks.map(track => ({
                                            value: track.id.toString(),
                                            label: track.name
                                        }))}
                                        value={track?.id.toString() || ""}
                                        onChange={(e) => {
                                            const selectedTrack = tracks.find(t => t.id.toString() === e.target.value);
                                            setTrack(selectedTrack || null);
                                        }}
                                    />
                                }
                            </td>
                            <td>
                                <AddButtonSimple onClick={() => addBootcampHandler()}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}