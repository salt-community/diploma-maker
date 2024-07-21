import './HistoryPage.css'
import { useQuery } from "react-query";
import { HistorySnapshotBundledData, HistorySnapshotResponse } from "../../util/types";
import { SpinnerDefault } from "../../components/MenuItems/Loaders/SpinnerDefault";
import { useState } from "react";
import { utcFormatter } from '../../util/helper';

type Props = {
    getHistory: () => void;
}

type BundledDataWithGeneratedAt = HistorySnapshotBundledData & { generatedAt: string };

type SortOrder = 'date-ascending' | 'date-descending';

export function HistoryPage({ getHistory }: Props) {
    const [history, setHistory] = useState<BundledDataWithGeneratedAt[]>();
    const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});
    const [sortOrder, setSortOrder] = useState<SortOrder>('date-descending');

    const { isLoading, data: student, isError } = useQuery({
        queryKey: ['getDiplomaById'],
        queryFn: () => getHistory(),
        onSuccess: (data: HistorySnapshotResponse[]) => {
            const formatDateToMinute = (dateStr: string) => {
                const date = new Date(dateStr);
                date.setSeconds(0, 0);
                return date.toISOString();
            };

            const bundledData = data.reduce((acc, curr) => {
                const generatedAtMinute = formatDateToMinute(curr.generatedAt.toString());
                const existingBundle = acc.find(bundle => bundle.generatedAt === generatedAtMinute);
                if (existingBundle) {
                    existingBundle.HistorySnapShots.push(curr);
                } else {
                    acc.push({ generatedAt: generatedAtMinute, HistorySnapShots: [curr] });
                }
                return acc;
            }, [] as BundledDataWithGeneratedAt[]);

            console.log(bundledData);
            setHistory(bundledData);
        },
        retry: false
    });

    const handleRowClick = (generatedAt: string) => {
        setExpandedRows(prev => ({ ...prev, [generatedAt]: !prev[generatedAt] }));
    };

    const handleSortChange = () => {
        setSortOrder(prevOrder => prevOrder === 'date-descending' ? 'date-ascending' : 'date-descending');
        if (history) {
            const sortedHistory = [...history].sort((a, b) => {
                if (sortOrder === 'date-ascending') {
                    return new Date(a.generatedAt).getTime() - new Date(b.generatedAt).getTime();
                } else {
                    return new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime();
                }
            });
            setHistory(sortedHistory);
        }
    };

    if (isLoading) {
        return (
            <div className='spinner-container'>
                <SpinnerDefault classOverride="spinner" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className='historypage__error'>
                <p>Error loading data.</p>
            </div>
        );
    }

    return (
        <main className='historypage'>  
            <section className='historypage__table-container'>
                <h1 className='historypage__title'>History Snapshots</h1>
                {history && history.length > 0 ? (
                    <table className='historypage__table'>
                        <thead className='historypage__table-head'>
                            <tr className='historypage__tablehead-row'>
                                <th className='historypage__table-header' onClick={handleSortChange}>
                                    Generated At {sortOrder === 'date-ascending' ? '↑' : '↓'}
                                </th>
                                <th className='historypage__table-header'>Bootcamp Name</th>
                                <td className='historypage__table-cell'>Number Of Students</td>
                                <th className='historypage__table-header'>Template Name</th>
                                <th className='historypage__table-header'>Status</th>
                            </tr>
                        </thead>
                        <tbody className='historypage__table-body'>
                            {history.map((bundle, index) => (
                                <>
                                    <tr key={bundle.generatedAt} className='historypage__table-row' onClick={() => handleRowClick(bundle.generatedAt)}>
                                        <td className='historypage__table-cell'>{utcFormatter(bundle.HistorySnapShots[0].generatedAt)}</td>
                                        <td className='historypage__table-cell'>{bundle.HistorySnapShots[0].bootcampName}</td>
                                        <td className='historypage__table-cell'>{bundle.HistorySnapShots.length}</td>
                                        <td className='historypage__table-cell'>{bundle.HistorySnapShots[0].basePdf.split('/').pop()}</td>
                                        <td className='historypage__table-cell'>-</td>
                                    </tr>
                                    {expandedRows[bundle.generatedAt] && (
                                    <tr className='historypage__table-row expanded'>
                                        <td className='historypage__table-cell'></td>
                                        <td className='historypage__table-cell' colSpan={5}>
                                            <table className='historypage__subtable'>
                                                <thead className='historypage__subtable-head'>
                                                    <tr className='historypage__subtable-row'>
                                                        <th className='historypage__subtable-header'>ID</th>
                                                        <th className='historypage__subtable-header'>Student Name</th>
                                                        <th className='historypage__subtable-header'>Verification Code</th>
                                                    </tr>
                                                </thead>
                                                <tbody className='historypage__subtable-body'>
                                                    {bundle.HistorySnapShots.map(snapshot => (
                                                        <tr key={snapshot.id} className='historypage__subtable-row'>
                                                            <td className='historypage__subtable-cell'>{snapshot.studentGuidId}</td>
                                                            <td className='historypage__subtable-cell'>{snapshot.studentName}</td>
                                                            <td className='historypage__subtable-cell'>{snapshot.verificationCode}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                )}
                                </>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className='historypage__no-data'>No history data available.</p>
                )}
            </section>
        </main>
    );
}