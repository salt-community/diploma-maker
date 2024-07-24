import { BootcampRequest, BootcampResponse, TrackResponse } from "../../util/types";
import { useState } from "react";
import { AlertPopup, PopupType } from "../MenuItems/Popups/AlertPopup";
import { useCustomAlert } from "../Hooks/useCustomAlert";
import './AddNewBootcampForm.css'
import { SelectOptions } from "../MenuItems/Inputs/SelectOptions";

type Props = {
    addNewBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
    bootcamps: BootcampResponse[] | null;
    tracks: TrackResponse[]
}

export default function AddNewBootcampForm({ addNewBootcamp, bootcamps, tracks }: Props) {
    const [name, setName] = useState<string>("");
    const [track, setTrack] = useState<TrackResponse | null>(null);
    const [gradDate, setGradDate] = useState<Date | null>(null);

    const { showPopup, popupContent, popupType, customAlert, closeAlert } = useCustomAlert();

    async function submitToAddBootcamp(){
        if(name === ""){
            customAlert('fail', "Input Validation Error", "Name cannot be empty");
            return;
        }
        bootcamps!.forEach(bootcamp => {
            if(bootcamp.name === name){
                customAlert('fail', "Input Validation Error", "The name already exists");
                return;
            }
        });
        if (!track) {
            customAlert('fail', "Input Validation Error", "Track must be selected");
            return;
        }
        if (!gradDate) {
            customAlert('fail', "Input Validation Error", "Graduation date must be selected");
            return;
        }
        const newBootcamp: BootcampRequest = {name: name, graduationDate: gradDate, trackId: track.id};
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
                        <th>Bootcamp Name</th>
                        <th>Graduation Date</th>
                        <th>Track</th>
                    </tr>
                    <tr>
                        <td className="input-cell">
                            <input 
                                type="text" 
                                onChange={event => setName(event.target.value)} 
                                className="text-input"
                            />
                        </td>
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
                            <button onClick={submitToAddBootcamp} className="add-button">Add</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}