import './HistoryManageTable.css'
import { useQuery } from "react-query";
import { useEffect, useRef, useState } from "react";
import { Viewer } from '@pdfme/ui';
import React from 'react';
import { HistorySnapshotBundledData, HistorySnapshotResponse, MakeActiveSnapshotRequestDto, TrackResponse } from '../../../util/types';
import { useCustomAlert } from '../../Hooks/useCustomAlert';
import { mapTemplateInputsToTemplateViewerFromSnapshot, templateInputsFromHistorySnapshot } from '../../../util/dataHelpers';
import { getPlugins } from '../../../util/helper';
import { SpinnerDefault } from '../../MenuItems/Loaders/SpinnerDefault';
import { ConfirmationPopup } from '../../MenuItems/Popups/ConfirmationPopup';
import { AlertPopup, CustomAlertPopupProps, PopupType } from '../../MenuItems/Popups/AlertPopup';
import { SearchInput } from '../../MenuItems/Inputs/SearchInput';
import { SortByIcon } from '../../MenuItems/Icons/SortbyIcon';
import { SelectOptions } from '../../MenuItems/Inputs/SelectOptions';
import { ArrowIcon } from '../../MenuItems/Icons/ArrowIcon';
import { AddButton } from '../../MenuItems/Buttons/AddButton';
import { SaveButton } from '../../MenuItems/Buttons/SaveButton';
import { VerifyIcon } from '../../MenuItems/Icons/VerifyIcon';
import { useCustomConfirmationPopup } from '../../Hooks/useCustomConfirmationPopup';
import { CloseWindowIcon } from '../../MenuItems/Icons/CloseWindowIcon';
import { getFontsData } from '../../../util/fontsUtil';
import { utcFormatter } from '../../../util/datesUtil';
import { delay } from '../../../util/timeUtil';

type Props = {
    getHistory: () => void;
    changeActiveHistorySnapShot: (snapshotUpdateRequest: MakeActiveSnapshotRequestDto) => void;
    tracks: TrackResponse[] | null;
};

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

export default function HistoryManageTable({ getHistory, changeActiveHistorySnapShot, tracks }: Props) {
    const [history, setHistory] = useState<BundledDataWithGeneratedAt[]>();
    const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});
    const [sortOrder, setSortOrder] = useState<SortOrder>('date-ascending');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredHistory, setFilteredHistory] = useState<BundledDataWithGeneratedAt[]>();

    const uiRef = useRef<HTMLDivElement | null>(null);
    const uiInstance = useRef<Viewer | null>(null);
    const [showDiploma, setShowDiploma] = useState<boolean>(false);
    const [activeTemplate, setActiveTemplate] = useState<number>(2);

    const {showPopup, popupContent, popupType, customAlert, closeAlert } = useCustomAlert();
    const { showConfirmationPopup, confirmationPopupContent, confirmationPopupType, confirmationPopupHandler, customPopup, closeConfirmationPopup } = useCustomConfirmationPopup();
    const [loading, setLoading] = useState<boolean>(true);
    let displayName;
    
    useEffect(() => {
        const loadDiploma = async () => {
            if (history && activeTemplate && showDiploma) {
                const selectedHistory = history[activeTemplate-1].HistorySnapShots[0];
                displayName = 
                    selectedHistory.bootcampName.includes("dnfs") ? 'Fullstack C# Dotnet'
                    : selectedHistory.bootcampName.includes("jfs") ? 'Fullstack Java'
                    : selectedHistory.bootcampName.includes("jsfs") ? 'Fullstack Javascript'
                    : 'ERR READING BOOTCAMP NAME';

                await delay(400);
                const inputs = templateInputsFromHistorySnapshot(history[activeTemplate-1].HistorySnapShots[0], displayName);
                const template = mapTemplateInputsToTemplateViewerFromSnapshot(history[activeTemplate-1].HistorySnapShots[0], inputs[0]);

                const font = await getFontsData();

                if (uiInstance.current) {
                    uiInstance.current.destroy();
                }
                uiInstance.current = new Viewer({
                    domContainer: uiRef.current,
                    template,
                    inputs,
                    options: { font },
                    plugins: getPlugins()
                });
            }
        };

        loadDiploma();

        return () => {
            if (uiInstance.current) {
                uiInstance.current.destroy();
                uiInstance.current = null;
            }
        };
    }, [uiRef, history, activeTemplate, showDiploma]);

    const { isLoading, data: student, isError, refetch } = useQuery({
        queryKey: ['getDiplomaById'],
        queryFn: () => getHistory(),
        onSuccess: (data: HistorySnapshotResponse[]) => {
            setLoading(true);
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
            setFilteredHistory(bundledData);
            setLoading(false);
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

        if (filteredHistory) {
            const sortedHistory = [...filteredHistory].sort((a, b) => {
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
            setFilteredHistory(sortedHistory);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTrackId = e.target.value;
        if (selectedTrackId === "") {
            setFilteredHistory(history);
        } else {
            const trackBootcampGuids = tracks?.find(track => track.id.toString() === selectedTrackId)?.bootcamps.map(b => b.guidId) || [];
            const filtered = history?.filter(bundle => 
                bundle.HistorySnapShots.some(snapshot => trackBootcampGuids.includes(snapshot.bootcampGuidId))
            );
            setFilteredHistory(filtered);
        }
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        handleSortChange(e.target.value as SortOrder);
    };

    const navigateToVerificationPage = (verificationCode: string) => {
        const url = `/verify/${verificationCode}`;
        window.open(url, '_blank');
    };

    const handleMakeActiveSnapshot = async (bundle: BundledDataWithGeneratedAt) => {
        try {
            closeConfirmationPopup();
            customAlert('loading', 'Changing Active Snapshot...', ``);
            await changeActiveHistorySnapShot({
                Ids: bundle.HistorySnapShots.map(snapshot => snapshot.id),
                StudentGuidIds: bundle.HistorySnapShots.map(snapshot => snapshot.studentGuidId)
            });
            refetch();
            customAlert('success', "Active template changed successfully!", `switched to new template`);
        } catch (error) {
            customAlert('fail', "Error trying to update active historysnapshot", `${error}`);
        }
    };

    const confirmMakeActiveSnapshot = async (bundle: BundledDataWithGeneratedAt) => {
        customPopup('question2', "Are you sure you want to change the active template?", "This will affect the verificationpage of all attached students", () => () => handleMakeActiveSnapshot(bundle));
    };

    const globalAbortHandler = () => {
        closeConfirmationPopup();
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
        <>
            <ConfirmationPopup
                title={confirmationPopupContent[0]}
                text={confirmationPopupContent[1]}
                show={showConfirmationPopup}
                confirmationPopupType={confirmationPopupType}
                abortClick={() => globalAbortHandler()}
                // @ts-ignore
                confirmClick={(inputContent?: string) => { confirmationPopupHandler(inputContent) }}
            />
            <AlertPopup
                title={popupContent[0]}
                text={popupContent[1]}
                popupType={popupType}
                show={showPopup}
                onClose={closeAlert}
            />
            <div className='historypage__table-container'>
                <h1 className='historypage__title'>Diploma Generation History</h1>
                <section className='historypage__filtersection'>
                    <div className='filtersection__filterwrapper'>                  
                        <SelectOptions
                            containerClassOverride='overview-page__select-container'
                            selectClassOverride='overview-page__select-box'
                            options={[
                                { value: "", label: "All Tracks" },
                                ...(tracks?.map(track => ({
                                    value: track.id.toString(),
                                    label: track.name
                                })) || [])
                            ]}
                            onChange={handleTrackChange}
                        />
                        <SearchInput
                            containerClassOverride='historypage__filtersection--input-wrapper'
                            inputClassOverride='historypage__filtersection__search-input'
                            searchQuery={searchQuery}
                            handleSearchChange={handleSearchChange}
                        />
                    </div>
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
                                <React.Fragment key={bundle.generatedAt}>
                                    <tr key={`${bundle.generatedAt}-main`} className='historypage__table-row' onClick={() => handleRowClick(bundle.generatedAt)}>
                                        <td className='historypage__table-cell'>{utcFormatter(bundle.HistorySnapShots[0].generatedAt)}</td>
                                        <td className='historypage__table-cell'>{bundle.HistorySnapShots[0].bootcampName}</td>
                                        <td className='historypage__table-cell'>{bundle.HistorySnapShots.length}</td>
                                        <td className='historypage__table-cell'>{bundle.HistorySnapShots[0].basePdfName.split('/').pop()}</td>
                                        <td className={'historypage__table-cell status ' + (bundle.HistorySnapShots.every(s => s.active) ? 'active' : bundle.HistorySnapShots.some(s => s.active) ? 'some-active' : 'inactive')}>
                                            {bundle.HistorySnapShots.every(s => s.active) 
                                                ? 'Current' 
                                                : bundle.HistorySnapShots.some(s => s.active) 
                                                ? `Current (${bundle.HistorySnapShots.filter(s => s.active).length})` 
                                                : 'Not Active'}
                                        </td>
                                    </tr>
                                    {expandedRows[bundle.generatedAt] && 
                                        <tr key={`${bundle.generatedAt}-expanded`} className='historypage__table-row expanded'>
                                            <td className='historypage__table-cell'>
                                                <div className='historypage__table-row--optionsmenu'>
                                                    <AddButton text='View Template' onClick={() => {setShowDiploma(true); setActiveTemplate(index + 1);}} />
                                                    <SaveButton 
                                                        onClick={() => confirmMakeActiveSnapshot(bundle)} 
                                                        saveButtonType="normal" 
                                                        textfield="Make Active Diploma" 
                                                    />
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
                                                                { snapshot.active &&
                                                                    <div className='historypage__subtable-cell--icon-wrapper' hover-data={`${snapshot.studentName} is using this template`}>
                                                                        <VerifyIcon />
                                                                    </div>
                                                                }
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    }
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                ) : 
                loading ?
                    <div className='spinner-container'>
                        <h1 className='spinner2__title'>Loading History...</h1>
                        <SpinnerDefault classOverride="spinner2" />
                    </div>
                :
                (   
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
        </>
    );
}