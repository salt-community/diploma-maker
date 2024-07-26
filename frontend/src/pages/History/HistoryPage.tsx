import './HistoryPage.css';
import { MakeActiveSnapshotRequestDto } from '../../util/types';
import HistoryManageTable from '../../components/Feature/History/HistoryManageTable';

type Props = {
    getHistory: () => void;
    changeActiveHistorySnapShot: (snapshotUpdateRequest: MakeActiveSnapshotRequestDto) => void;
};

export function HistoryPage({ getHistory, changeActiveHistorySnapShot }: Props) {
    return (
        <main className='historypage'>
            <HistoryManageTable getHistory={getHistory} changeActiveHistorySnapShot={changeActiveHistorySnapShot} />
        </main>
    );
}
