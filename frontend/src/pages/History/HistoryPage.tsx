import './HistoryPage.css';
import { MakeActiveSnapshotRequestDto, TrackResponse } from '../../util/types';
import HistoryManageTable from '../../components/Feature/History/HistoryManageTable';
import { PopupType } from '../../components/MenuItems/Popups/AlertPopup';

type Props = {
    getHistory: () => void;
    changeActiveHistorySnapShot: (snapshotUpdateRequest: MakeActiveSnapshotRequestDto) => void;
    tracks: TrackResponse[] | null;
    showPopup: Boolean;
    customAlert: (alertType: PopupType, title: string, content: string) => void;
    closeAlert: () => void;
};

export function HistoryPage({ getHistory, changeActiveHistorySnapShot, tracks, showPopup, customAlert, closeAlert }: Props) {
    return (
        <main className='historypage'>
            <HistoryManageTable getHistory={getHistory} changeActiveHistorySnapShot={changeActiveHistorySnapShot} tracks={tracks} showPopup={showPopup} customAlert={customAlert} closeAlert={closeAlert}/>
        </main>
    );
}
