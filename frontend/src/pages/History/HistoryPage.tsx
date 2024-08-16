import './HistoryPage.css';
import { MakeActiveSnapshotRequestDto, TrackResponse } from '../../util/types';
import HistoryManageTable from '../../components/Feature/History/HistoryManageTable';
import { CustomAlertPopupProps, PopupType } from '../../components/MenuItems/Popups/AlertPopup';

type Props = {
    getHistory: () => void;
    changeActiveHistorySnapShot: (snapshotUpdateRequest: MakeActiveSnapshotRequestDto) => void;
    tracks: TrackResponse[] | null;
    customAlertProps: CustomAlertPopupProps;
};

export function HistoryPage({ getHistory, changeActiveHistorySnapShot, tracks, customAlertProps }: Props) {
    return (
        <main className='historypage'>
            <HistoryManageTable 
                getHistory={getHistory} 
                changeActiveHistorySnapShot={changeActiveHistorySnapShot} 
                tracks={tracks} 
                customAlertProps={customAlertProps}
            />
        </main>
    );
}
