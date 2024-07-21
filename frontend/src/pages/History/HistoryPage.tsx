import './HistoryPage.css'
import { useQuery } from "react-query";
import { HistorySnapshotBundledData, HistorySnapshotResponse } from "../../util/types";
import { SpinnerDefault } from "../../components/MenuItems/Loaders/SpinnerDefault";
import { useEffect, useRef, useState } from "react";
import { getFontsData, getPlugins, utcFormatter } from '../../util/helper';
import { ArrowIcon } from '../../components/MenuItems/Icons/ArrowIcon';
import { SearchInput } from '../../components/MenuItems/Inputs/SearchInput';
import { SortByIcon } from '../../components/MenuItems/Icons/SortbyIcon';
import { SelectOptions } from '../../components/MenuItems/Inputs/SelectOptions';
import { ModifyButton } from '../../components/MenuItems/Buttons/ModifyButton';
import { AddButton } from '../../components/MenuItems/Buttons/AddButton';
import { ViewTemplateIcon } from '../../components/MenuItems/Icons/ViewTemplateIcon';
import CustomCheckBoxRound from '../../components/MenuItems/Inputs/CustomCheckBoxRound';
import { SaveButton } from '../../components/MenuItems/Buttons/SaveButton';
import { Viewer } from '@pdfme/ui';
import { mapTemplateInputsToTemplateViewerFromSnapshot, templateInputsFromHistorySnapshot } from '../../util/dataHelpers';
import { CloseWindowIcon } from '../../components/MenuItems/Icons/CloseWindowIcon';

type Props = {
    getHistory: () => void;
    changeActiveHistorySnapShot: (id: number) => void;
}

type BundledDataWithGeneratedAt = HistorySnapshotBundledData & { generatedAt: string };

type SortOrder =
    'date-ascending' | 'date-descending' | 'bootcamp-name-ascending' | 'bootcamp-name-descending' |
    'number-of-students-ascending' | 'number-of-students-descending' | 'template-name-ascending' | 
    'template-name-descending' | 'status-ascending' | 'status-descending';

const sortOrderOptions = [
    { value: 'date-ascending', label: 'Date Ascending' },
    { value: 'date-descending', label: 'Date Descending' },
    { value: 'bootcamp-name-ascending', label: 'Bootcamp Name Ascending' },
    { value: 'bootcamp-name-descending', label: 'Bootcamp Name Descending' },
    { value: 'number-of-students-ascending', label: 'Number of Students Ascending' },
    { value: 'number-of-students-descending', label: 'Number of Students Descending' },
    { value: 'template-name-ascending', label: 'Template Name Ascending' },
    { value: 'template-name-descending', label: 'Template Name Descending' },
    { value: 'status-ascending', label: 'Status Ascending' },
    { value: 'status-descending', label: 'Status Descending' },
];

export function HistoryPage({ getHistory, changeActiveHistorySnapShot }: Props) {
    const [history, setHistory] = useState<BundledDataWithGeneratedAt[]>();
    const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});
    const [sortOrder, setSortOrder] = useState<SortOrder>('date-descending');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const uiRef = useRef<HTMLDivElement | null>(null);
    const uiInstance = useRef<Viewer | null>(null);
    const [showDiploma, setShowDiploma] = useState<boolean>(false);
    const [activeTemplate, setActiveTemplate] = useState<number>(1);

    useEffect(() => {
        if(history && activeTemplate){
            const inputs = templateInputsFromHistorySnapshot(history[activeTemplate].HistorySnapShots[0]);
            const template = mapTemplateInputsToTemplateViewerFromSnapshot(history[activeTemplate].HistorySnapShots[0], inputs[0])

            console.log(template);

            getFontsData().then((font) => {
                if(uiInstance.current){
                    uiInstance.current.destroy();
                }
                uiInstance.current = new Viewer({
                    domContainer: uiRef.current,
                    template,
                    inputs,
                    options: { font },
                    plugins: getPlugins()
                });
            })

            return () => {
                if(uiInstance.current){
                    uiInstance.current.destroy();
                    uiInstance.current = null;
                }
            }
            
        }
    }, [uiRef, history, activeTemplate])

    const { isLoading, data: student, isError } = useQuery({
        queryKey: ['getDiplomaById'],
        queryFn: () => getHistory(),
        onSuccess: (data: HistorySnapshotResponse[]) => {
            const formatDateToSecond = (dateStr: string) => {
                const date = new Date(dateStr);
                date.setMilliseconds(0);
                return date.toISOString();
            };


            const bundledData = data.reduce((acc, curr) => {
                const generatedAtMinute = formatDateToSecond(curr.generatedAt.toString());
                const existingBundle = acc.find(bundle => bundle.generatedAt === generatedAtMinute);
                if (existingBundle) {
                    existingBundle.HistorySnapShots.push(curr);
                } else {
                    acc.push({ generatedAt: generatedAtMinute, HistorySnapShots: [curr] });
                }
                return acc;
            }, [] as BundledDataWithGeneratedAt[]);

            setHistory(bundledData);
        },
        retry: false
    });

    const handleRowClick = (generatedAt: string) => {
        setExpandedRows(prev => ({ ...prev, [generatedAt]: !prev[generatedAt] }));
    };

    const handleSortChange = (sortType: SortOrder) => {
        setSortOrder(prevOrder => {
            if (prevOrder.startsWith(sortType.split('-')[0])) {
                return prevOrder === sortType ? `${sortType.split('-')[0]}-ascending` as SortOrder : sortType;
            } else {
                return sortType;
            }
        });
        
        if (history) {
            const sortedHistory = [...history].sort((a, b) => {
                switch (sortType) {
                    case 'date-ascending':
                        return new Date(a.generatedAt).getTime() - new Date(b.generatedAt).getTime();
                    case 'date-descending':
                        return new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime();
                    case 'bootcamp-name-ascending':
                        return a.HistorySnapShots[0].bootcampName.localeCompare(b.HistorySnapShots[0].bootcampName);
                    case 'bootcamp-name-descending':
                        return b.HistorySnapShots[0].bootcampName.localeCompare(a.HistorySnapShots[0].bootcampName);
                    case 'number-of-students-ascending':
                        return a.HistorySnapShots.length - b.HistorySnapShots.length;
                    case 'number-of-students-descending':
                        return b.HistorySnapShots.length - a.HistorySnapShots.length;
                    case 'template-name-ascending':
                        return a.HistorySnapShots[0].basePdfName.split('/').pop()!.localeCompare(b.HistorySnapShots[0].basePdfName.split('/').pop()!);
                    case 'template-name-descending':
                        return b.HistorySnapShots[0].basePdfName.split('/').pop()!.localeCompare(a.HistorySnapShots[0].basePdfName.split('/').pop()!);
                    case 'status-ascending':
                        return (a.HistorySnapShots[0].active ? 1 : 0) - (b.HistorySnapShots[0].active ? 1 : 0);
                    case 'status-descending':
                        return (b.HistorySnapShots[0].active ? 1 : 0) - (a.HistorySnapShots[0].active ? 1 : 0);
                    default:
                        return 0;
                }
            });
            setHistory(sortedHistory);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const filteredHistory = history?.filter(bundle =>
        bundle.HistorySnapShots.some(snapshot =>
            snapshot.bootcampName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            snapshot.templateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            snapshot.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            snapshot.verificationCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            snapshot.bootcampGuidId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            snapshot.studentGuidId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            snapshot.footer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            snapshot.intro.toLowerCase().includes(searchQuery.toLowerCase()) ||
            snapshot.main.toLowerCase().includes(searchQuery.toLowerCase()) ||
            snapshot.link.toLowerCase().includes(searchQuery.toLowerCase()) ||
            snapshot.basePdfName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            utcFormatter(snapshot.generatedAt).toLowerCase().includes(searchQuery.toLowerCase()) ||
            (snapshot.active ? 'active' : 'inactive').includes(searchQuery.toLowerCase())
        )
    );

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        handleSortChange(e.target.value as SortOrder);
    };

    const navigateToVerificationPage = (verificationCode: string) => {
        const url = `/verify/${verificationCode}`;
        window.open(url, '_blank');
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
            <div className='historypage__table-container'>
                <h1 className='historypage__title'>Diploma Generation History</h1>
                <section className='historypage__filtersection'>
                    <SearchInput
                        containerClassOverride='historypage__filtersection--input-wrapper'
                        inputClassOverride='historypage__filtersection__search-input'
                        searchQuery={searchQuery}
                        handleSearchChange={handleSearchChange}
                    />
                    <div className='historypage__sortbysection'>
                        <SortByIcon />
                        <SelectOptions
                            containerClassOverride='historypage__sort-by-section__select-container'
                            selectClassOverride='historypage__sort-by-section__select-box'
                            options={sortOrderOptions}
                            onChange={handleSelectChange}
                            value={sortOrder}
                        />
                    </div>
                </section>
                {filteredHistory && filteredHistory.length > 0 ? (
                    <table className='historypage__table'>
                        <thead className='historypage__table-head'>
                            <tr className='historypage__tablehead-row'>
                                <th
                                    className={'historypage__table-header ' + (sortOrder.includes('date-ascending') || sortOrder.includes('date-descending') ? (sortOrder === 'date-descending' ? 'descending' : '') : '')}
                                    onClick={() => handleSortChange(sortOrder === 'date-descending' ? 'date-ascending' : 'date-descending')}
                                >
                                    Generated At <div className={'icon-container ' + (!sortOrder.includes('date-ascending') && !sortOrder.includes('date-descending') ? 'hidden' : '')}><ArrowIcon rotation={sortOrder === 'date-descending' ? 180 : 0} /></div>
                                </th>
                                <th
                                    className={'historypage__table-header ' + (sortOrder.includes('bootcamp-name-ascending') || sortOrder.includes('bootcamp-name-descending') ? (sortOrder === 'bootcamp-name-descending' ? 'descending' : '') : '')}
                                    onClick={() => handleSortChange(sortOrder === 'bootcamp-name-descending' ? 'bootcamp-name-ascending' : 'bootcamp-name-descending')}
                                >
                                    Bootcamp Name <div className={'icon-container ' + (!sortOrder.includes('bootcamp-name-ascending') && !sortOrder.includes('bootcamp-name-descending') ? 'hidden' : '')}><ArrowIcon rotation={sortOrder === 'bootcamp-name-descending' ? 180 : 0} /></div>
                                </th>
                                <th
                                    className={'historypage__table-header ' + (sortOrder.includes('number-of-students-ascending') || sortOrder.includes('number-of-students-descending') ? (sortOrder === 'number-of-students-descending' ? 'descending' : '') : '')}
                                    onClick={() => handleSortChange(sortOrder === 'number-of-students-descending' ? 'number-of-students-ascending' : 'number-of-students-descending')}
                                >
                                    Number Of Students <div className={'icon-container ' + (!sortOrder.includes('number-of-students-ascending') && !sortOrder.includes('number-of-students-descending') ? 'hidden' : '')}><ArrowIcon rotation={sortOrder === 'number-of-students-descending' ? 180 : 0} /></div>
                                </th>
                                <th
                                    className={'historypage__table-header ' + (sortOrder.includes('template-name-ascending') || sortOrder.includes('template-name-descending') ? (sortOrder === 'template-name-descending' ? 'descending' : '') : '')}
                                    onClick={() => handleSortChange(sortOrder === 'template-name-descending' ? 'template-name-ascending' : 'template-name-descending')}
                                >
                                    Template Name <div className={'icon-container ' + (!sortOrder.includes('template-name-ascending') && !sortOrder.includes('template-name-descending') ? 'hidden' : '')}><ArrowIcon rotation={sortOrder === 'template-name-descending' ? 180 : 0} /></div>
                                </th>
                                <th
                                    className={'historypage__table-header ' + (sortOrder.includes('status-ascending') || sortOrder.includes('status-descending') ? (sortOrder === 'status-descending' ? 'descending' : '') : '')}
                                    onClick={() => handleSortChange(sortOrder === 'status-descending' ? 'status-ascending' : 'status-descending')}
                                >
                                    Status <div className={'icon-container ' + (!sortOrder.includes('status-ascending') && !sortOrder.includes('status-descending') ? 'hidden' : '')}><ArrowIcon rotation={sortOrder === 'status-descending' ? 180 : 0} /></div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className='historypage__table-body'>
                            {filteredHistory.map((bundle, index) => (
                                <>
                                    <tr key={bundle.generatedAt} className='historypage__table-row' onClick={() => handleRowClick(bundle.generatedAt)}>
                                        <td className='historypage__table-cell'>{utcFormatter(bundle.HistorySnapShots[0].generatedAt)}</td>
                                        <td className='historypage__table-cell'>{bundle.HistorySnapShots[0].bootcampName}</td>
                                        <td className='historypage__table-cell'>{bundle.HistorySnapShots.length}</td>
                                        <td className='historypage__table-cell'>{bundle.HistorySnapShots[0].basePdfName.split('/').pop()}</td>
                                        <td className={'historypage__table-cell status ' + (bundle.HistorySnapShots[0].active ? 'active' : 'inactive')}>{bundle.HistorySnapShots[0].active ? 'Current' : 'Not Active'}</td>
                                    </tr>
                                    {expandedRows[bundle.generatedAt] && 
                                    <tr className='historypage__table-row expanded'>
                                        <td className='historypage__table-cell'>
                                            <div className='historypage__table-row--optionsmenu'>
                                                <AddButton text='View Template' onClick={() => {setActiveTemplate(index); setShowDiploma(true)}} icon={<ViewTemplateIcon />}/>
                                                <SaveButton onClick={() => {changeActiveHistorySnapShot(index)}} saveButtonType={'normal'} textfield='Make Active Diploma'/>
                                            </div>
                                        </td>
                                        <td className='historypage__table-cell' colSpan={5}>
                                            
                                            <table className='historypage__subtable'>
                                                <thead className='historypage__subtable-head'>
                                                    <tr className='historypage__subtable-row'>
                                                        <th className='historypage__subtable-header'>Student Name</th>
                                                        <th className='historypage__subtable-header'>Id</th>
                                                        <th className='historypage__subtable-header'>Verification Code</th>
                                                    </tr>
                                                </thead>
                                                <tbody className='historypage__subtable-body'>
                                                    {bundle.HistorySnapShots.map(snapshot => (
                                                        <tr key={snapshot.id} className='historypage__subtable-row' onClick={() => navigateToVerificationPage(snapshot.verificationCode)}>
                                                            <td className='historypage__subtable-cell'>{snapshot.studentName}</td>
                                                            <td className='historypage__subtable-cell'>{snapshot.studentGuidId}</td>
                                                            <td className='historypage__subtable-cell'>{snapshot.verificationCode}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                }
                                </>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className='historypage__no-data'>No history data available.</p>
                )}
            </div>
            <div onClick={() => {setShowDiploma(false)}} className={'diplomapreview-container ' + (showDiploma ? 'visible' : '')}>
                <div className='diplomapreview-container-content'>
                    <CloseWindowIcon />
                    <div
                        className="pdfpreview-previewcontainer"
                        ref={uiRef}
                        style={{ width: "100%", height: "100%", marginBottom: '2rem'}}
                    />
                </div>
            </div>
        </main>
    );
}