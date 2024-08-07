import { BootcampRequest, BootcampResponse, TrackResponse } from "../../util/types";
import { useEffect, useState } from "react";
import { AlertPopup, PopupType } from "../MenuItems/Popups/AlertPopup";
import { useCustomAlert } from "../Hooks/useCustomAlert";
import './AddNewBootcampForm.css'
import { SelectOptions } from "../MenuItems/Inputs/SelectOptions";
import { AddButtonSimple } from "../MenuItems/Buttons/AddButtonSimple";

type Props = {
    addNewBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
    bootcamps: BootcampResponse[] | null;
    tracks: TrackResponse[]
}

export default function AddNewBootcampForm({ addNewBootcamp, bootcamps, tracks }: Props) {
    const [name, setName] = useState<string>("");
    const [track, setTrack] = useState<TrackResponse | null>();
    const [gradDate, setGradDate] = useState<Date | null>(null);

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
        const newBootcamp: BootcampRequest = {graduationDate: gradDate, trackId: track.id};
        await addNewBootcamp(newBootcamp);

        customAlert('success', "Successfully added!", "Successfully added new bootcamp to database");
    }

    return (
        <div className="content-container">
            <AlertPopup title={popupContent[0]} text={popupContent[1]} popupType={popupType} show={showPopup} onClose={closeAlert}/>
            <br />
            <table className="auto-table">
                <div className="newbootcamp-title-container">
                    <h1 className="newbootcamp-title">Add New Bootcamp</h1>
                </div>
                <tbody>
                    <tr>
                        <th>Graduation Date</th>
                        <th>Track</th>
                        <th></th>
                        <th></th>
                    </tr>
                    <tr>
                        <td className="date-cell">
                            <input 
                                type="date" 
                                onChange={event => setGradDate(new Date(event.target.value))} 
                                className="date-input"
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
    )
}