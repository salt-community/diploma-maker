import './HistoryPage.css'
import { useQuery } from "react-query";
import { HistorySnapshotResponse} from "../../util/types";
import { SpinnerDefault } from "../../components/MenuItems/Loaders/SpinnerDefault";
import { useState } from "react";

type Props = {
    getHistory: () => void;
}

export function HistoryPage( { getHistory }: Props) {
    const [history, setHistory] = useState<HistorySnapshotResponse[]>();

    const { isLoading, data: student, isError } = useQuery({
        queryKey: ['getDiplomaById'],
        queryFn: () => getHistory(),
        onSuccess: (data: HistorySnapshotResponse[]) => {
            console.log(data);
        },
        retry: false
    });

    if (isLoading) {
        return (
            <div className='spinner-container'>
                <SpinnerDefault classOverride="spinner"/>
            </div>
        )
    }

    if (isError) {
        return (
            <>
                
            </>
        );
    }

    return (
        <>
            <main className='historypage-container'>
                
            </main>
        </>
    )
}

