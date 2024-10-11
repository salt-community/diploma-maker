import './HistoryPage.css';
import { MakeActiveSnapshotRequestDto, TrackResponse } from '../../util/types';
import HistoryManageTable from '../../components/Feature/History/HistoryManageTable';

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
