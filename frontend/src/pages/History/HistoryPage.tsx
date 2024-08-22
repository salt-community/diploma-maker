import './HistoryPage.css';
import { MakeActiveSnapshotRequestDto, TrackResponse } from '../../util/types';
import HistoryManageTable from '../../components/Feature/History/HistoryManageTable';
import { CustomAlertPopupProps, PopupType } from '../../components/MenuItems/Popups/AlertPopup';

type Props = {
    getHistory: () => void;
    changeActiveHistorySnapShot: (snapshotUpdateRequest: MakeActiveSnapshotRequestDto) => void;
    tracks: TrackResponse[] | null;
};

export function HistoryPage({ getHistory, changeActiveHistorySnapShot, tracks }: Props) {
    return (
        <main className='historypage'>
            <HistoryManageTable 
                getHistory={getHistory} 
                changeActiveHistorySnapShot={changeActiveHistorySnapShot} 
                tracks={tracks} 
            />
        </main>
    );
}
