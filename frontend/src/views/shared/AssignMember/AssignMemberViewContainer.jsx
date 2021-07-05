/**
 * @module AssignMemberViewContainer
 *
 * @description
 * Container part of dialog to assign userstories
 *
 * @author Hans-Peter Görg
 **/

import React, {useEffect, useState, useCallback} from 'react';
import {difference, intersectionWith, union, filter} from 'lodash';
import {CheckBox, Text} from 'grommet';
import {useTranslation} from "react-i18next";
import {restGetAll} from "../../../service/serviceGetRest";
import {isAuthorizationErrorCode, isCriticalCode} from "../../../shared/util/generalUtils";
import AssignMemberViewPresenter from "./AssignMemberViewPresenter";


export default function AssignMemberViewContainer({setErrorCode, setShowErrorView, setShowDependents, dependents, setDependents}) {

    const searchField = 'email';
    const {t} = useTranslation();
    const [docsNotAssigned, setDocsNotAssigned] = useState([]);
    const [docsAssigned, setDocsAssigned] = useState([]);

    const [checkedAssigned, setCheckedAssigned] = useState([]);
    const [checkedNotAssigned, setCheckedNotAssigned] = useState([]);

    const [changedContent, setChangedContent] = useState(false);


    const [sort, setSort] = useState(({
        property: searchField,
        direction: 'asc'
    }));


    const title = t('assign.dependents.members.title');

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
            return {member_ref: doc._id};
        }));

        setShowDependents(false);
    };

    const onClose = (e) => {
        e.preventDefault();

        if(!changedContent) {
            setShowDependents(false);
        }
    };

    const onClickAssign = (e) => {
        e.preventDefault();

        let selectedDocs = checkedNotAssigned.map(checked => {
            return filter(docsNotAssigned, {'email': checked})[0];
        });

        setDocsNotAssigned(difference(docsNotAssigned, selectedDocs));
        setDocsAssigned(union(docsAssigned, selectedDocs))
        setCheckedNotAssigned([]);

        setChangedContent(true);
    }

    const onClickUnAssign = (e) => {
        e.preventDefault();

        let selectedDocs = checkedAssigned.map(checked => {
            return filter(docsAssigned, {'email': checked})[0];
        });

        setDocsAssigned(difference(docsAssigned, selectedDocs));
        setDocsNotAssigned(union(docsNotAssigned, selectedDocs))
        setCheckedAssigned([]);

        setChangedContent(true);
    }

    const doMoves = useCallback((result) => {
        setDocsAssigned(intersectionWith(result.documents, dependents, (a, b) => {
                return (a._id === b.member_ref);
            }
        ));

        let notAssigned = [];
        for (let i = 0; i < result.documents.length; i++) {
            let doc = result.documents[i];
            let found = false;
            for (let j = 0; j < dependents.length; j++) {
                if (dependents[j].member_ref === doc._id) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                notAssigned.push(doc);
            }
        }

        setDocsNotAssigned(notAssigned);
    }, [dependents])

    useEffect(() => {
        const getDocs = (result) => {
            if (isAuthorizationErrorCode(result.code) || isCriticalCode(result.code)) {
                setErrorCode(result.code);
                setShowErrorView(true);
            } else {
                //at least one member must exist - otherwise login could not have happened
                setDocsAssigned(result.documents);
                doMoves(result);
            }
        };
        restGetAll('member').then(result => getDocs(result));
    }, [setErrorCode, setShowErrorView, doMoves]);


    const columnsNotAssigned = [
        {
            property: 'checkbox',
            render: doc => (
                <CheckBox
                    key={doc.email}
                    label={""}
                    checked={checkedNotAssigned.indexOf(doc.email) !== -1}
                    onChange={e => onCheckUnAssign(e, doc.email)}
                />
            ),
            size: '5px',
        },
        {
            property: searchField,
            header: t('assign.dependents.not.assigned.header'),
            render: doc => (
                <Text size={"small"}>{doc.email}</Text>
            ),
            size: '125px',
        },
        {
            property: 'role',
            header: t('assign.dependents.members.role'),
            render: doc => (
                <Text size={"small"}>{t(doc.role)}</Text>
            ),
            size: '25px',
        }
    ];

    const columnsAssigned = [
        {
            property: 'checkbox',
            render: doc => (
                <CheckBox
                    key={doc.email}
                    label={""}
                    checked={checkedAssigned.indexOf(doc.email) !== -1}
                    onChange={e => onCheckAssign(e, doc.email)}
                />
            ),
            size: '5px'
        },
        {
            property: searchField,
            header: t('assign.dependents.assigned.header'),
            render: doc => (
                <Text size={"small"} color={"brand"}>{doc.email}</Text>
            ),
            size: '100px',
        },
        {
            property: 'role',
            header: t('assign.dependents.members.role'),
            render: doc => (
                <Text size={"small"}>{t(doc.role)}</Text>
            ),
            size: '25px',
        }
    ];

    return (
        <AssignMemberViewPresenter
            title={title}
            searchField={searchField}
            onOK={onOK}
            onClickAssign={onClickAssign}
            onClickUnAssign={onClickUnAssign}
            columnsAssigned={columnsAssigned}
            columnsNotAssigned={columnsNotAssigned}
            docsAssigned={docsAssigned}
            docsNotAssigned={docsNotAssigned}
            checkedAssigned={checkedAssigned}
            checkedNotAssigned={checkedNotAssigned}
            sort={sort}
            setSort={setSort}
            onClose={onClose}
        >
        </AssignMemberViewPresenter>
    );
}
