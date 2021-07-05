/**
 * @module UserstoriesViewContainer
 *
 * @description
 * Container part of the view to edit userstories
 *
 * @author Hans-Peter Görg
 **/
import React, {useState} from 'react';

import {useHistory} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import {cloneDeep} from 'lodash';

import {CODE} from "../../shared/constants/code";
import {logout} from "../../action/actionLogout";
import {restPostCreate} from "../../service/servicePostRest";
import {restPutUpdate} from "../../service/servicePutRest";
import {restDelete} from "../../service/serviceDeleteRest";
import UserstoriesViewPresenter from "./UserstoriesViewPresenter";
import {HELP_CONTEXT_ID, PRIORITY} from "../../shared/constants/enums";
import {extendedTrim, hasContent} from "../../shared/util/generalUtils";
import {getVerificationWfOptionCreated, getVerificationWfOptionForStep, getVerificationWfOptionsForSelect} from "../util/VerificationWfUtils";
import {setHelpContextId} from "../Help/HelpContext";


export default function UserstoriesViewContainer() {
    const {t} = useTranslation();
    setHelpContextId(HELP_CONTEXT_ID.USERSTORY);

    const DUMMY_NEW_ID = 'NEW';

    const history = useHistory();

    const newDoc = {
        _id: DUMMY_NEW_ID,
        version: 1,
        name: '',
        description: '',
        storypoints: 5,
        verification: getVerificationWfOptionCreated(t),
        priority: PRIORITY.MEDIUM
    };


    const [errorCode, setErrorCode] = useState(CODE.OK);
    const [showErrorView, setShowErrorView] = useState(false);
    const [doc, setDoc] = useState(newDoc);
    const [showSearch, setShowSearch] = useState(false);
    const [deletable, setDeletable] = useState(false);
    const [errorName, setErrorName] = useState('');
    const [errorDescription, setErrorDescription] = useState('');
    const [status, setStatus] = useState('');
    const [storypoints, setStorypoints] = useState(newDoc.storypoints);

    const [verificationWfOptions] = useState(getVerificationWfOptionsForSelect(t));

    const clearValidationErrors = (clearStatus) => {
        setErrorName('');
        setErrorDescription('');
        if(clearStatus) {
            setStatus('');
        }
    };

    const onSelectDoc = (selectedDoc) => {
        clearValidationErrors(true);
        selectedDoc.verification = getVerificationWfOptionForStep(t, selectedDoc.verification);
        setDoc(selectedDoc);
        setStorypoints(selectedDoc.storypoints);
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
        setStorypoints(newDoc.storypoints);
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

        if (!valid) {
            setDeletable(false);
        }

        return valid;
    };

    const onClickDelete = async () => {
        clearValidationErrors(true);

        const result = await restDelete('userstory', doc._id, doc.version);

        switch (result.code) {

            case CODE.WRONG_VERSION:
                setStatus(t('toolbar.status.changed.in.meantime'));
                result.actualDocument.verification = getVerificationWfOptionForStep(t, result.actualDocument.verification);
                setDoc(result.actualDocument);
                setStorypoints(result.actualDocument.storypoints);
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
        const result = await restPutUpdate('userstory', valueForSave);

        switch (result.code) {

            case CODE.DUPLICATE_KEY:
                setStatus(t('toolbar.status.dupkey.name'))
                setErrorName(t('general.error.name.required'));
                break;
            case CODE.WRONG_VERSION:
                setStatus(t('toolbar.status.changed.in.meantime'));
                result.actualDocument.verification = getVerificationWfOptionForStep(t, result.actualDocument.verification);
                setDoc(result.actualDocument);
                setStorypoints(result.actualDocument.storypoints);
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

        const result = await restPostCreate('userstory', valueForSave);

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
        <UserstoriesViewPresenter
            status={status}
            doc={doc} setDoc={setDoc}
            areInputsValid={areInputsValid}
            createDoc={createDoc} updateDoc={updateDoc}
            setShowSearch={setShowSearch}
            errorName={errorName} errorDescription={errorDescription}
            onClickNew={onClickNew} onClickDelete={onClickDelete} onClickHome={onClickHome}
            deletable={deletable}
            errorCode={errorCode} setErrorCode={setErrorCode}
            showErrorView={showErrorView} setShowErrorView={setShowErrorView}
            showSearch={showSearch}
            onSelectDoc={onSelectDoc}
            verificationWfOptions={verificationWfOptions}
            storypoints={storypoints}
            setStorypoints={setStorypoints}
        >
        </UserstoriesViewPresenter>
    );
}
