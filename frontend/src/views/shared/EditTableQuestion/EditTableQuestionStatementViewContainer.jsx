/**
 * @module EditTableQuestionStatementViewContainer
 *
 * @description
 * Container part of the view dialog component to edit question - answer scenarios
 *
 * @author Hans-Peter Görg
 **/
import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import {findIndex, cloneDeep, trimEnd, trimStart} from 'lodash';
import {Text, Anchor} from 'grommet';
import {Edit, Trash} from "grommet-icons";
import {deepMerge} from "grommet/utils";
import EditTableQuestionStatementViewPresenter from "./EditTableQuestionStatementViewPresenter";
import {THEME} from "../../../configTheme";

export default function EditTableQuestionStatementViewContainer({data, setData, setShowMe, title}) {
    const {t} = useTranslation();

    const [editDataQuestion, setEditDataQuestion] = useState('');
    const [editDataStatement, setEditDataStatement] = useState('');
    const [oldDataQuestion, setOldDataQuestion] = useState('');
    const [oldDataStatement, setOldDataStatement] = useState('');
    const [errorEditTable, setErrorEditTable] = useState('');
    const [editHint, setEditHint] = useState(t('edittable.title.new.entry'));
    const [changedContent, setChangedContent] = useState(false);


    const searchField = 'question';

    const ThemeEditTable = deepMerge(THEME, {
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

    const onClickInitEdit = (event, dataRow) => {
        event.preventDefault();
        if (errorEditTable !== '') {
            setErrorEditTable('');
        }
        setOldDataQuestion(dataRow.question);
        setEditDataQuestion(dataRow.question);

        setOldDataStatement(dataRow.statement);
        setEditDataStatement(dataRow.statement);

        setEditHint(t('edittable.title.edit.entry'));
    }

    const onChangeDataEntryQuestion = (event) => {
        event.preventDefault();
        if (errorEditTable !== '') {
            setErrorEditTable('');
        }
        setEditDataQuestion(event.target.value);
    }

    const onChangeDataEntryStatement = (event) => {
        event.preventDefault();
        if (errorEditTable !== '') {
            setErrorEditTable('');
        }
        setEditDataStatement(event.target.value);
    }

    const onClickEditEntry = (event) => {
        event.stopPropagation();
        setChangedContent(true);

        if (errorEditTable !== '') {
            setErrorEditTable('');
        }
        let dataEntryQuestion = trimStart(editDataQuestion);
        dataEntryQuestion = trimEnd(dataEntryQuestion);

        let dataEntryStatement = trimStart(editDataStatement);
        dataEntryStatement = trimEnd(dataEntryStatement);

        if ((dataEntryQuestion === '') || (dataEntryStatement === '')) {
            return;
        }

        let newDataRows = cloneDeep(data);

        let pos = findIndex(data, (aDataEntry) => {
            return (
                (aDataEntry['question'] === dataEntryQuestion) &&
                (aDataEntry['statement'] === dataEntryStatement));
        });

        //check for duplicates
        if (oldDataQuestion === '') {
            //case new entry
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

        if (oldDataQuestion === '') {
            //new measure
            newDataRows.push({question: dataEntryQuestion, statement: dataEntryStatement});
            setData(newDataRows);
        } else {
            //changing existing entry
            let posOld = findIndex(data, (aDataEntry) => {
                return (
                    (aDataEntry['question'] === oldDataQuestion) &&
                    (aDataEntry['statement'] === oldDataStatement));
            });

            newDataRows[posOld] = {
                question: dataEntryQuestion,
                statement: dataEntryStatement
            };
            setData(newDataRows);
        }

        setOldDataQuestion('');
        setOldDataStatement('');
        setEditDataQuestion('');
        setEditDataStatement('');
    }

    const onClickDeleteEntry = (event, dataRow) => {
        event.preventDefault();

        if (errorEditTable !== '') {
            setErrorEditTable('');
        }
        let newDataEntries = [];
        data.forEach(aDataEntry => {
            if (
                (aDataEntry.question !== dataRow.question) ||
                (aDataEntry.statement !== dataRow.statement)
            ) {
                newDataEntries.push(aDataEntry);
            }
        });

        setData(newDataEntries);
        setOldDataQuestion('');
        setOldDataStatement('');
        setEditDataQuestion('');
        setEditDataStatement('');
        setEditHint(t('edittable.title.new.entry'));

        setChangedContent(true);
    };

    const onClickNewEntry = (event) => {
        event.stopPropagation();
        setChangedContent(true);

        if (errorEditTable !== '') {
            setErrorEditTable('');
        }
        setOldDataQuestion('');
        setOldDataStatement('');
        setEditDataQuestion('');
        setEditDataStatement('');
        setEditHint(t('edittable.title.new.entry'));
    };

    const onOK = (e) => {
        e.preventDefault();
        setShowMe(false);
    };

    const onClose = (e) => {
        e.preventDefault();
        if(! changedContent) {
            setShowMe(false);
        }
    };

    const columns = [
        {
            property: 'edit',
            header: <Text size={"small"}>{t('general.column.title.edit')}</Text>,
            render: dataRow => (
                <Anchor icon={<Edit size={'medium'}/>}
                        hoverIndicator
                        alignSelf={"center"}
                        onClick={(e) => onClickInitEdit(e, dataRow)}
                >
                </Anchor>
            ),
            size: '5px',
            sortable: false
        },
        {
            property: 'question',
            header: <Text size={"small"}>{t('edittable.title.question')}</Text>,
            render: dataRow => (
                <Text size={"small"}>{dataRow.question}</Text>
            ),
            size: '100px',
            sortable: true
        },
        {
            property: 'statement',
            header: <Text size={"small"}>{t('edittable.title.statement')}</Text>,
            render: dataRow => (
                <Text size={"small"}>{dataRow.statement}</Text>
            ),
            size: '100px',
            sortable: true
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
            size: '5px',
            sortable: false
        },
    ];

    return (
        <EditTableQuestionStatementViewPresenter
            title={title}
            ThemeEditTable={ThemeEditTable}
            searchField={searchField}
            columns={columns}
            data={data}
            sort={sort}
            setSort={setSort}
            editDataQuestion={editDataQuestion}
            editDataStatement={editDataStatement}
            onChangeDataEntryQuestion={onChangeDataEntryQuestion}
            onChangeDataEntryStatement={onChangeDataEntryStatement}
            onClickEditEntry={onClickEditEntry}
            onClickNewEntry={onClickNewEntry}
            onClickDeleteEntry={onClickDeleteEntry}
            errorEditTable={errorEditTable}
            onOK={onOK}
            onClose={onClose}
            editHint={editHint}
        >
        </EditTableQuestionStatementViewPresenter>
    );
}
