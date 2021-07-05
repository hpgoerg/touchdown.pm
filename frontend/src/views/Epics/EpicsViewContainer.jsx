/**
 * @module EpicsViewContainer
 *
 * @description
 * Container part of the view to edit epics
 *
 * @author Hans-Peter Görg
 **/
import React, {useState} from 'react';

import moment from "moment";
import {useHistory} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import {cloneDeep} from "lodash";

import {CODE} from "../../shared/constants/code";
import {logout} from "../../action/actionLogout";
import {restPostCreate} from "../../service/servicePostRest";
import {restPutUpdate} from "../../service/servicePutRest";
import {restDelete} from "../../service/serviceDeleteRest";
import EpicsViewPresenter from "./EpicsViewPresenter";
import {extendedTrim, hasContent} from "../../shared/util/generalUtils";
import {getVerificationWfOptionCreated, getVerificationWfOptionForStep, getVerificationWfOptionsForSelect} from "../util/VerificationWfUtils";
import {setHelpContextId} from "../Help/HelpContext";
import {HELP_CONTEXT_ID} from "../../shared/constants/enums";

export default function EpicsViewContainer() {
    const {t} = useTranslation();
    setHelpContextId(HELP_CONTEXT_ID.EPIC);

    const DUMMY_NEW_ID = 'NEW';

    const history = useHistory();

    const newDoc = {
        _id: DUMMY_NEW_ID,
        version: 1,
        name: '',
        description: '',
        startdate: moment().toDate(),
        finishdate: moment().add(14, 'days').toDate(),
        verification: getVerificationWfOptionCreated(t),
        userstories: []
    };


    const [errorCode, setErrorCode] = useState(CODE.OK);
    const [showErrorView, setShowErrorView] = useState(false);
    const [doc, setDoc] = useState(newDoc);
    const [startdate, setStartdate] = useState(newDoc.startdate);
    const [finishdate, setFinishdate] = useState(newDoc.finishdate);
    const [showSearch, setShowSearch] = useState(false);
    const [deletable, setDeletable] = useState(false);
    const [errorName, setErrorName] = useState('');
    const [errorDescription, setErrorDescription] = useState('');
    const [errorFinishdate, setErrorFinishdate] = useState('');
    const [status, setStatus] = useState('');
    const [userstories, setUserstories] = useState(newDoc.userstories);
    const [showUserstories, setShowUserstories] = useState(false);
    const [verificationWfOptions] = useState(getVerificationWfOptionsForSelect(t));

    const clearValidationErrors = (clearStatus) => {
        setErrorName('');
        setErrorDescription('');
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
        setUserstories([]);
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

        value.description = extendedTrim(value.description, false);
        if (! hasContent(value.description)) {
            setErrorDescription(t('general.error.description.required'));
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

        const result = await restDelete('epic', doc._id, doc.version);

        switch (result.code) {

            case CODE.WRONG_VERSION:
                setStatus(t('toolbar.status.changed.in.meantime'));
                result.actualDocument.verification = getVerificationWfOptionForStep(t, result.actualDocument.verification);
                setDoc(result.actualDocument);
                setUserstories(result.actualDocument.userstories);
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

        const result = await restPutUpdate('epic', valueForSave);

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

        const result = await restPostCreate('epic', valueForSave);

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
        <EpicsViewPresenter
            status={status}
            doc={doc} setDoc={setDoc}
            areInputsValid={areInputsValid}
            createDoc={createDoc} updateDoc={updateDoc}
            setShowSearch={setShowSearch}
            errorName={errorName} errorDescription={errorDescription}
            startdate={startdate} setStartdate={setStartdate}
            finishdate={finishdate} setFinishdate={setFinishdate} errorFinishdate={errorFinishdate}
            onClickNew={onClickNew} onClickDelete={onClickDelete} onClickHome={onClickHome}
            deletable={deletable}
            errorCode={errorCode} setErrorCode={setErrorCode}
            showErrorView={showErrorView} setShowErrorView={setShowErrorView}
            showSearch={showSearch}
            onSelectDoc={onSelectDoc}
            showUserstories={showUserstories}
            setShowUserstories={setShowUserstories}
            userstories={userstories}
            setUserstories={setUserstories}
            verificationWfOptions={verificationWfOptions}
        >
        </EpicsViewPresenter>
    );
}
