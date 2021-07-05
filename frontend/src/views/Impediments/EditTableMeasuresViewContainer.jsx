/**
 * @module EditTableMeasuresViewContainer
 *
 * @description
 * Container part of the view component to edit impediment measures
 *
 * @author Hans-Peter Görg
 **/
import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {findIndex, cloneDeep, trimEnd, trimStart} from 'lodash';
import {Text, CheckBox, Anchor} from 'grommet';
import {Edit, Trash} from "grommet-icons";
import {deepMerge} from "grommet/utils";
import EditTableMeasuresViewPresenter from "./EditTableMeasuresViewPresenter";
import {THEME} from "../../configTheme";


export default function EditTableMeasuresViewContainer({data, setData, resetMeasureEdit, setResetMeasureEdit}) {

    const {t} = useTranslation();

    const [editData, setEditData] = useState('');
    const [oldData, setOldData] = useState('');
    const [errorEditTable, setErrorEditTable] = useState('');
    const [editHint, setEditHint] = useState(t('edittable.title.new.measure'));

    const searchField = 'measure';

    useEffect(() => {
        if(resetMeasureEdit) {
            setEditData('');
            setResetMeasureEdit(false);
            setEditHint(t('edittable.title.new.measure'));
        }
    }, [data, t, resetMeasureEdit, setResetMeasureEdit, setEditData]);


    const ThemeEditTable = deepMerge(THEME, {
        checkBox: {
            size: "38px"
        },
        global: {
            font: {
                family: 'Roboto',
                size: '14px',
                height: '12px'
            }
        }
    });

    const [sort, setSort] = useState(({
        property: searchField,
        direction: 'asc'
    }));

    const onClickToggleDone = (event, dataRow) => {
        let newDataRows = cloneDeep(data);

        let pos = findIndex(data, (aDataEntry) => {
            return aDataEntry['measure'] === dataRow.measure;
        });

        newDataRows[pos] = {measure: dataRow.measure, done: event.target.checked};
        setData(newDataRows);
    }

    const onClickInitEdit = (event, dataRow) => {
        event.preventDefault();
        if(errorEditTable !== '') {
            setErrorEditTable('');
        }
        setOldData(dataRow.measure);
        setEditData(dataRow.measure);
        setEditHint(t('edittable.title.edit.measure'));
    }

    const onChangeDataEntry = (event) => {
        event.preventDefault();
        if(errorEditTable !== '') {
            setErrorEditTable('');
        }
        setEditData(event.target.value);
    }

    const onClickEditEntry = (event) => {
        event.preventDefault();
        if(errorEditTable !== '') {
            setErrorEditTable('');
        }
        let dataEntry = trimStart(editData);
        dataEntry = trimEnd(dataEntry);

        if (dataEntry === '') {
            return;
        }

        let newDataRows = cloneDeep(data);

        let pos = findIndex(data, (aDataEntry) => {
            return aDataEntry['measure'] === dataEntry;
        });

        //check for duplicates
        if(oldData === '') {
            if (pos !== -1) {
                setErrorEditTable(t('edittable.entry.already.defined'));
                return;
            }
        } else {
            if (pos !== -1) {
                setErrorEditTable(t('edittable.entry.already.defined.or.no.changes'));
                return;
            }
        }

        if (oldData === '') {
            //new measure
            newDataRows.push({measure: dataEntry, done: false});
            setData(newDataRows);
        } else {
            //changing existing measure
            let posOld = findIndex(data, (aMeasure) => {
                return aMeasure['measure'] === oldData;
            });

            newDataRows[posOld] = {measure: dataEntry, done: newDataRows[posOld].done};
            setData(newDataRows);
        }

        setOldData('');
        setEditData('');
    }

    const onClickDeleteEntry = (event, dataRow) => {
        event.preventDefault();
        if(errorEditTable !== '') {
            setErrorEditTable('');
        }
        let newDataEntries = [];
        data.forEach(aDataEntry => {
            if (aDataEntry.measure !== dataRow.measure) {
                newDataEntries.push(aDataEntry);
            }
        });

        setData(newDataEntries);
        setOldData('');
        setEditData('');
        setEditHint(t('edittable.title.new.measure'));
    }

    const onClickNewEntry = (event) => {
        event.preventDefault();
        if(errorEditTable !== '') {
            setErrorEditTable('');
        }
        setOldData('');
        setEditData('');
        setEditHint(t('edittable.title.new.measure'));
    }

    const columns = [
        {
            property: 'edit',
            header: <Text size={"small"}>{t('edittable.title.edit')}</Text>,
            render: dataRow => (
                <Anchor icon={<Edit size={'medium'}/>}
                        hoverIndicator
                        alignSelf={"center"}
                        onClick={(e) => onClickInitEdit(e, dataRow)}
                >
                </Anchor>
            ),
            size: '5px'
        },
        {
            property: 'measure',
            header: <Text size={"small"}>{t('edittable.title.measures')}</Text>,
            render: dataRow => (
                <Text size={"small"}>{dataRow.measure}</Text>
            ),
            size: '100px',
        },
        {
            property: 'done',
            header: <Text size={"small"}>{t('edittable.done')}</Text>,
            render: dataRow => (
                <CheckBox
                    key={dataRow.done}
                    checked={dataRow.done}
                    onChange={(e) => onClickToggleDone(e, dataRow)}
                    disabled={editHint === t('edittable.title.edit.measure')}
                />
            ),
            size: '50px',
        },
        {
            property: 'delete',
            header: <Text size={"small"}>{t('general.delete')}</Text>,
            render: dataRow => (
                <Anchor icon={<Trash size={'medium'}/>}
                        hoverIndicator
                        alignSelf={"center"}
                        onClick={(e) => onClickDeleteEntry(e, dataRow)}
                >
                </Anchor>
            ),
            size: '10px',
            sortable: false
        },
    ];

    return (
        <EditTableMeasuresViewPresenter
            ThemeEditTable={ThemeEditTable}
            searchField={searchField}
            columns={columns}
            data={data}
            setEditData={setEditData}
            sort={sort}
            setSort={setSort}
            editData={editData}
            onChangeDataEntry={onChangeDataEntry}
            onClickEditEntry={onClickEditEntry}
            onClickNewEntry={onClickNewEntry}
            errorEditTable={errorEditTable}
            resetMeasureEdit={resetMeasureEdit}
            setResetMeasureEdit={setResetMeasureEdit}
            editHint={editHint}
        >
        </EditTableMeasuresViewPresenter>
    );
}
