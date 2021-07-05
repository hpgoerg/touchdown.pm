/**
 * @module AssignUserstoryViewContainer
 *
 * @description
 * Container part of dialog to assign userstories
 *
 * @author Hans-Peter Görg
 **/

import  React, {useEffect, useState, useCallback} from 'react';
import {difference, intersectionWith, union, filter, cloneDeep} from 'lodash';
import {Button, CheckBox, Text} from 'grommet';
import {useTranslation} from "react-i18next";
import {findIndex} from 'lodash';
import {restGetAll} from "../../../service/serviceGetRest";
import {Edit} from "grommet-icons";
import AssignUserstoryViewPresenter from "./AssignUserstoryViewPresenter";
import {isAuthorizationErrorCode, isCriticalCode} from "../../../shared/util/generalUtils";
import {getVerificationWf} from "../../../shared/backendConfig/backendConfig";
import {CODE} from "../../../shared/constants/code";


export default function AssignUserstoryViewContainer({setErrorCode, setShowErrorView, setShowDependents, dependents, setDependents}) {

    const {t} = useTranslation();
    const [docsNotAssigned, setDocsNotAssigned] = useState([]);
    const [docsAssigned, setDocsAssigned] = useState([]);
    const [showEditUserstory, setShowEditUserstory] = useState(false);
    const [updateDoc, setUpdateDoc] = useState();
    const [dataForDataChart, setDataForDataChart] = useState();

    const [checkedAssigned, setCheckedAssigned] = useState([]);
    const [checkedNotAssigned, setCheckedNotAssigned] = useState([]);
    const [showDataChart, setShowDataChart] = useState(false);

    const [changedContent, setChangedContent] = useState(false);


    const [sortByName, setSortByName] = useState(({
        property: 'name',
        direction: 'asc'
    }));

    const [sortByWf, setSortByWf] = useState(({
        property: 'verification',
        direction: 'asc'
    }));

    const title = t('assign.dependents.stories.title');

    const onCheckUnAssign = (event, value) => {
        if (event.target.checked) {
            setCheckedNotAssigned([...checkedNotAssigned, value]);
        } else {
            setCheckedNotAssigned(checkedNotAssigned.filter(item => item !== value));
        }
        setCheckedAssigned([]);
    };

    const onCheckAssign = (event, value) => {
        if (event.target.checked) {
            setCheckedAssigned([...checkedAssigned, value]);
        } else {
            setCheckedAssigned(checkedAssigned.filter(item => item !== value));
        }
        setCheckedNotAssigned([]);
    };

    const onOK = (e) => {
        e.preventDefault();

        setDependents(docsAssigned.map(doc => {
            return {userstory_ref: doc._id};
        }));

        setShowDependents(false);
    };

    const onClose = (e) => {
        e.preventDefault();

        if(!changedContent) {
            setShowDependents(false);
        }
    };


    /**
     * Aggregate storypoints by verification workflow status
     * and cass DataChartViewStoryPoints to show graph
     *
     * @param e {object} - event
     */
    const onClickDataChart = (e) => {
        e.preventDefault();

        const verificationWf = getVerificationWf();
        let data = [];

        verificationWf.forEach( (aStatus) => {
            let aStatusEntry = { workflowStatus: t(aStatus), storypoints: 0};
            data.push(aStatusEntry);
        });

        for (let i = 0; i < docsAssigned.length; i++) {
            let doc = docsAssigned[i];
            let workflowStatus = t(doc.verification);

            let pos = findIndex(data, (aDataEntry) =>
                { return aDataEntry["workflowStatus"] === workflowStatus; });

            data[pos].storypoints = data[pos].storypoints + doc.storypoints;
        }

        setDataForDataChart(data);

        setShowDataChart(true);
    }

    const onClickAssign = (e) => {
        e.preventDefault();

        let selectedDocs = checkedNotAssigned.map(checked => {
            return filter(docsNotAssigned, {'name': checked})[0];
        });

        setDocsNotAssigned(difference(docsNotAssigned, selectedDocs));
        setDocsAssigned(union(docsAssigned, selectedDocs))
        setCheckedNotAssigned([]);

        setChangedContent(true);
    }

    const onClickUnAssign = (e) => {
        e.preventDefault();

        let selectedDocs = checkedAssigned.map(checked => {
            return filter(docsAssigned, {'name': checked})[0];
        });

        setDocsAssigned(difference(docsAssigned, selectedDocs));
        setDocsNotAssigned(union(docsNotAssigned, selectedDocs))
        setCheckedAssigned([]);

        setChangedContent(true);
    }

    const doMoves = useCallback((result) => {
        setDocsAssigned(intersectionWith(result.documents, dependents, (a, b) => {
                return (a._id === b.userstory_ref);
            }
        ));

        let notAssigned = [];
        for (let i = 0; i < result.documents.length; i++) {
            let doc = result.documents[i];
            let found = false;
            for (let j = 0; j < dependents.length; j++) {
                if (dependents[j].userstory_ref === doc._id) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                notAssigned.push(doc);
            }
        }

        setDocsNotAssigned(notAssigned);
    }, [dependents]);

    const onEditUserstory = (e, docToUpdate) => {
        e.preventDefault();
        setShowEditUserstory(true);
        setUpdateDoc(docToUpdate);
    };

    const onCloseUserstory = (isDeleted, updatedDoc) => {
        setShowEditUserstory(false);

        let newDocsAssigned = [];
        for(let i = 0; i < docsAssigned.length; i++) {
            let doc = docsAssigned[i];

            if(doc._id === updatedDoc._id) {
                if(! isDeleted) {
                    doc = cloneDeep(updatedDoc);
                    newDocsAssigned.push(doc);
                }
            } else {
                newDocsAssigned.push(doc);
            }
        }

        setDocsAssigned(newDocsAssigned);
    };

    useEffect(() => {
        const getDocs = (result) => {
            if (isAuthorizationErrorCode(result.code) || isCriticalCode(result.code)) {
                setErrorCode(result.code);
                setShowErrorView(true);
            } else {
                if(result.code === CODE.NO_ENTRIES_FOUND) {
                    setDocsAssigned([]);
                } else {
                    setDocsAssigned(result.documents);
                    doMoves(result);
                }
            }
        };
        restGetAll('userstory').then(result => getDocs(result));
    }, [setErrorCode, setShowErrorView, doMoves]);


    const columnsNotAssigned = [
        {
            property: 'checkbox',
            render: doc => (
                <CheckBox
                    key={doc.name}
                    label={""}
                    checked={checkedNotAssigned.indexOf(doc.name) !== -1}
                    onChange={e => onCheckUnAssign(e, doc.name)}
                />
            ),
            size: '5px',
        },
        {
            property: 'name',
            header: t('assign.dependents.not.assigned.header'),
            render: doc => (
                <Text size={"small"}>{doc.name}</Text>
            ),
            size: '100px',
        },
        {
            property: 'verification',
            header: t('assign.dependents.stories.workflow'),
            render: doc => (
                <Text size={"small"}>{t(doc.verification)}</Text>
            ),
            size: '25px',
        }
    ];

    const columnsAssigned = [
        {
            property: 'checkbox',
            render: doc => (
                <CheckBox
                    key={doc.name}
                    label={""}
                    checked={checkedAssigned.indexOf(doc.name) !== -1}
                    onChange={e => onCheckAssign(e, doc.name)}
                />
            ),
            size: '5px'
        },
        {
            property: 'name',
            header: t('assign.dependents.assigned.header'),
            render: doc => (
                <Text size={"small"} color={"brand"}>{doc.name}</Text>
            ),
            size: '120px',
        },
        {
            property: 'verification',
            header: t('assign.dependents.stories.workflow'),
            render: doc => (
                <Text size={"small"}>{t(doc.verification)}</Text>
            ),
            size: '50px',
        },
        {
            property: 'storypoints',
            header: t('assign.dependents.stories.storypoints'),
            render: doc => (
                <Text size={"small"} alignSelf={"center"}>{doc.storypoints}</Text>
            ),
            size: '35px',
        },
        {
            property: 'edit',
            header: t('general.column.title.edit'),
            render: doc => (
                <Button icon={<Edit size={'medium'}/>}
                        hoverIndicator
                        alignSelf={"center"}
                        onClick={(e) => onEditUserstory(e, doc)}
                >
                </Button>
            ),
            size: '25px',
            sortable: false
        }
    ];

    return (
        <AssignUserstoryViewPresenter
            title={title}
            onOK={onOK}
            onClickAssign={onClickAssign}
            onClickUnAssign={onClickUnAssign}
            columnsAssigned={columnsAssigned}
            columnsNotAssigned={columnsNotAssigned}
            docsAssigned={docsAssigned}
            docsNotAssigned={docsNotAssigned}
            checkedAssigned={checkedAssigned}
            checkedNotAssigned={checkedNotAssigned}

            sortByName={sortByName}
            setSortByName={setSortByName}

            sortByWf={sortByWf}
            setSortByWf={setSortByWf}

            showEditUserstory={showEditUserstory}
            updateDoc={updateDoc}

            onCloseUserstory={onCloseUserstory}
            showDataChart={showDataChart}
            dataForDataChart={dataForDataChart}
            setShowDataChart={setShowDataChart}
            onClickDataChart={onClickDataChart}
            onClose={onClose}
        >
        </AssignUserstoryViewPresenter>
    );
}
