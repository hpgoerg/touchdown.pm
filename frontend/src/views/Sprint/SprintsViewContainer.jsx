/**
 * @module SprintsViewContainer
 *
 * @description
 * Container part of the view to edit sprints
 *
 * @author Hans-Peter Görg
 **/
import React, {useState} from 'react';

import moment from "moment";
import {useHistory} from 'react-router-dom';
import {useTranslation} from "react-i18next";

import {CODE} from "../../shared/constants/code";
import {logout} from "../../action/actionLogout";
import {restPostCreate} from "../../service/servicePostRest";
import {restPutUpdate} from "../../service/servicePutRest";
import {restDelete} from "../../service/serviceDeleteRest";
import SprintsViewPresenter from "./SprintsViewPresenter";
import {cloneDeep} from "lodash";
import {extendedTrim, hasContent} from "../../shared/util/generalUtils";
import {getVerificationWfOptionCreated, getVerificationWfOptionForStep, getVerificationWfOptionsForSelect} from "../util/VerificationWfUtils";
import {setHelpContextId} from "../Help/HelpContext";
import {HELP_CONTEXT_ID} from "../../shared/constants/enums";


export default function SprintsViewContainer() {
    const {t} = useTranslation();
    setHelpContextId(HELP_CONTEXT_ID.SPRINT);

    const DUMMY_NEW_ID = 'NEW';

    const history = useHistory();

    const newDoc = {
        _id: DUMMY_NEW_ID,
        version: 1,
        name: '',
        goal: '',
        startdate: moment().toDate(),
        finishdate: moment().add(14, 'days').toDate(),
        verification: getVerificationWfOptionCreated(t),

        userstories: [],
        tasks: [],
        team: [],
        retrospective: [],
        review: []
    };


    const [errorCode, setErrorCode] = useState(CODE.OK);
    const [showErrorView, setShowErrorView] = useState(false);
    const [doc, setDoc] = useState(newDoc);
    const [startdate, setStartdate] = useState(newDoc.startdate);
    const [finishdate, setFinishdate] = useState(newDoc.finishdate);
    const [showSearch, setShowSearch] = useState(false);
    const [deletable, setDeletable] = useState(false);
    const [errorName, setErrorName] = useState('');
    const [errorGoal, setErrorGoal] = useState('');
    const [errorFinishdate, setErrorFinishdate] = useState('');
    const [status, setStatus] = useState('');
    const [userstories, setUserstories] = useState(newDoc.userstories);
    const [showUserstories, setShowUserstories] = useState(false);
    const [review, setReview] = useState(newDoc.review);
    const [showReview, setShowReview] = useState(false);
    const [retrospective, setRetrospective] = useState(newDoc.retrospective);
    const [showRetrospective, setShowRetrospective] = useState(false);
    const [team, setTeam] = useState(newDoc.team);
    const [showTeam, setShowTeam] = useState(false);
    const [tasks, setTasks] = useState(newDoc.tasks);
    const [showTaskBoard, setShowTaskBoard] = useState(false);
    const [verificationWfOptions] = useState(getVerificationWfOptionsForSelect(t));

    const clearValidationErrors = (clearStatus) => {
        setErrorName('');
        setErrorGoal('');
        setErrorFinishdate('');
        if(clearStatus) {
            setStatus('');
        }
    };

    const onSelectDoc = (selectedDoc) => {
        clearValidationErrors(true);

        selectedDoc.verification = getVerificationWfOptionForStep(t, selectedDoc.verification);
        setDoc(selectedDoc);
        setStartdate(selectedDoc.startdate);
        setFinishdate(selectedDoc.finishdate);
        setUserstories(selectedDoc.userstories);
        setTeam(selectedDoc.team);
        setTasks(selectedDoc.tasks);
        setRetrospective(selectedDoc.retrospective);
        setReview(selectedDoc.review);
        setDeletable(true);
    };

    const onClickHome = (e) => {
        e.preventDefault();
        logout();
        history.push("/");
    };

    const onClickNew = (clearStatus) => {
        clearValidationErrors(clearStatus);
        setDoc(newDoc);
        setStartdate(newDoc.startdate);
        setFinishdate(newDoc.finishdate);
        setTeam(newDoc.team);
        setTasks(newDoc.tasks);
        setRetrospective(newDoc.retrospective);
        setReview(newDoc.review);
        setDeletable(false);
    };

    const areInputsValid = (value) => {
        clearValidationErrors(true);
        let valid = true;

        value.name = extendedTrim(value.name, false);
        if (! hasContent(value.name)) {
            setErrorName(t('general.error.name.unique.required'));
            valid = false;
        }
        value.goal = extendedTrim(value.goal, false);
        if (! hasContent(value.goal)) {
            setErrorGoal(t('general.error.goal.required'));
            valid = false;
        }

        const diff = moment(value.finishdate).startOf('day').diff(moment(value.startdate).startOf('day'), 'days');
        if (diff <= 0) {
            setErrorFinishdate(t('general.error.finishdate'));
            valid = false;
        }

        if(!valid) {
            setDeletable(false);
        }

        return valid;
    };

    const onClickDelete = async () => {
        clearValidationErrors(true);

        const result = await restDelete('sprint', doc._id, doc.version);

        switch (result.code) {

            case CODE.WRONG_VERSION:
                setStatus(t('toolbar.status.changed.in.meantime'));
                result.actualDocument.verification = getVerificationWfOptionForStep(t, result.actualDocument.verification);
                setDoc(result.actualDocument);
                setUserstories(result.actualDocument.userstories);
                setTeam(result.actualDocument.team);
                setTasks(result.actualDocument.tasks);
                setRetrospective(result.actualDocument.retrospective);
                setReview(result.actualDocument.review);
                setStartdate(result.actualDocument.startdate);
                setFinishdate(result.actualDocument.finishdate);
                break;
            case CODE.NO_ENTRY_FOUND:
                setStatus(t('toolbar.status.deleted.in.meantime'));
                onClickNew(false);
                break;
            case CODE.OK:
                setStatus(t('toolbar.status.deleted'));
                onClickNew(false);
                break;
            default:
                setErrorCode(result.code);
                setShowErrorView(true);
        }


    };

    const updateDoc = async (value) => {
        clearValidationErrors(true);

        let valueForSave = cloneDeep(value);
        valueForSave.verification = valueForSave.verification['valueKey'];

        const result = await restPutUpdate('sprint', valueForSave);


        switch (result.code) {

            case CODE.DUPLICATE_KEY:
                setStatus(t('toolbar.status.dupkey.name'))
                setErrorName(t('general.error.name.required'));
                break;
            case CODE.WRONG_VERSION:
                setStatus(t('toolbar.status.changed.in.meantime'));
                result.actualDocument.verification = getVerificationWfOptionForStep(t, result.actualDocument.verification);
                setDoc(result.actualDocument);
                setStartdate(result.actualDocument.startdate);
                setFinishdate(result.actualDocument.finishdate);
                setUserstories(result.actualDocument.userstories);
                setTeam(result.actualDocument.team);
                setTasks(result.actualDocument.tasks);
                setRetrospective(result.actualDocument.retrospective);
                setReview(result.actualDocument.review);
                break;
            case CODE.NO_ENTRY_FOUND:
                setStatus(t('toolbar.status.deleted.in.meantime'));
                onClickNew(false);
                break;
            case CODE.OK:
                result.actualDocument.verification = getVerificationWfOptionForStep(t, result.actualDocument.verification);
                setDoc(result.actualDocument);
                setStatus(t('toolbar.status.saved'));
                break;
            default:
                setErrorCode(result.code);
                setShowErrorView(true);
        }
    };


    const createDoc = async (value) => {
        let valueForSave = cloneDeep(value);
        valueForSave.verification = valueForSave.verification['valueKey'];

        const result = await restPostCreate('sprint', valueForSave);

        switch (result.code) {

            case CODE.DUPLICATE_KEY:
                setStatus(t('toolbar.status.dupkey.name'))
                setErrorName(t('general.error.name.required'));
                break;
            case CODE.OK:
                result.insertedDoc.verification = getVerificationWfOptionForStep(t, result.insertedDoc.verification);
                setDoc(result.insertedDoc);
                setDeletable(true);
                setStatus(t('toolbar.status.saved'));
                break;
            default:
                setErrorCode(result.code);
                setShowErrorView(true);
        }
    };

    return (
        <SprintsViewPresenter
            status={status}
            doc={doc}
            setDoc={setDoc}
            areInputsValid={areInputsValid}
            createDoc={createDoc}
            updateDoc={updateDoc}
            setShowSearch={setShowSearch}
            errorName={errorName}
            startdate={startdate}
            setStartdate={setStartdate}
            finishdate={finishdate}
            setFinishdate={setFinishdate}
            errorFinishdate={errorFinishdate}
            onClickNew={onClickNew}
            onClickDelete={onClickDelete}
            onClickHome={onClickHome}
            deletable={deletable}
            errorCode={errorCode}
            setErrorCode={setErrorCode}
            showErrorView={showErrorView}
            setShowErrorView={setShowErrorView}
            showSearch={showSearch}
            onSelectDoc={onSelectDoc}
            showUserstories={showUserstories}
            setShowUserstories={setShowUserstories}
            userstories={userstories}
            setUserstories={setUserstories}
            errorGoal={errorGoal}

            showRetrospective={showRetrospective}
            setShowRetrospective={setShowRetrospective}
            retrospective={retrospective}
            setRetrospective={setRetrospective}

            showReview={showReview}
            setShowReview={setShowReview}
            review={review}
            setReview={setReview}

            showTeam={showTeam}
            setShowTeam={setShowTeam}
            team={team}
            setTeam={setTeam}

            tasks={tasks}
            setTasks={setTasks}
            showTaskBoard={showTaskBoard}
            setShowTaskBoard={setShowTaskBoard}

            verificationWfOptions={verificationWfOptions}
        >
        </SprintsViewPresenter>
    );
}
