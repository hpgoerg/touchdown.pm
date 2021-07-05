/**
 * @module UserstoryViewContainer
 *
 * @description
 * Container part of the dialog to update a given userstory
 *
 * @author Hans-Peter Görg
 **/
import React, {useState} from 'react';

import {useHistory} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import {cloneDeep} from 'lodash';

import {CODE} from "../../shared/constants/code";
import {restPutUpdate} from "../../service/servicePutRest";

import {HELP_CONTEXT_ID} from "../../shared/constants/enums";
import {extendedTrim, hasContent, isSet} from "../../shared/util/generalUtils";
import {getVerificationWfOptionForStep, getVerificationWfOptionsForSelect} from "../util/VerificationWfUtils";
import {setHelpContextId} from "../Help/HelpContext";
import UserstoryViewPresenter from "./UserstoryViewPresenter";
import {logout} from "../../action/actionLogout";


export default function UserstoryViewContainer({docToUpdate, onCloseUserstory}) {
    const {t} = useTranslation();
    setHelpContextId(HELP_CONTEXT_ID.USERSTORY);

    const history = useHistory();


    const getDocToUpdate = () => {
        let theDoc = cloneDeep(docToUpdate);
        theDoc.verification = getVerificationWfOptionForStep(t, theDoc.verification);
        return(theDoc);
    }

    const [errorCode, setErrorCode] = useState(CODE.OK);
    const [showErrorView, setShowErrorView] = useState(false);
    const [doc, setDoc] = useState(getDocToUpdate());
    const [errorName, setErrorName] = useState('');
    const [errorDescription, setErrorDescription] = useState('');
    const [hint, setHint] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [verificationWfOptions] = useState(getVerificationWfOptionsForSelect(t));
    const [isDeleted, setIsDeleted] = useState(false);
    const [updatedDoc, setUpdatedDoc] = useState(docToUpdate);
    const [storypoints, setStorypoints] = useState(docToUpdate.storypoints);
    const [changedContent, setChangedContent] = useState(false);

    const clearValidationErrors = (clearHint) => {
        setErrorName('');
        setErrorDescription('');
        if(clearHint) {
            setHint('');
        }
    };

    const onClickHome = (e) => {
        e.preventDefault();
        logout();
        history.push("/");
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

        return valid;
    };

    const onBack = (e) => {
        e.preventDefault();

        if(! isDeleted) {
            if(isSet(updatedDoc.verification["valueKey"])) {
                updatedDoc.verification = updatedDoc.verification["valueKey"];
            }
        }
        onCloseUserstory(isDeleted, updatedDoc);
    };

    const onClose = (e) => {
        e.stopPropagation();

        if(!changedContent) {
            onCloseUserstory(isDeleted, docToUpdate);
        }
    };

    const updateDoc = async (value) => {
        clearValidationErrors(true);

        //even if save does not change something, avoid that user does not see hint after save
        setChangedContent(true);

        let valueForSave = cloneDeep(value);
        valueForSave.verification = valueForSave.verification['valueKey'];
        const result = await restPutUpdate('userstory', valueForSave);

        switch (result.code) {

            case CODE.DUPLICATE_KEY:
                setHint(t('toolbar.status.dupkey.name'))
                setErrorName(t('general.error.name.required'));
                break;
            case CODE.WRONG_VERSION:
                setHint(t('toolbar.status.changed.in.meantime'));
                result.actualDocument.verification = getVerificationWfOptionForStep(t, result.actualDocument.verification);
                setDoc(result.actualDocument);
                setUpdatedDoc(result.actualDocument);
                setStorypoints(result.actualDocument.storypoints);
                break;
            case CODE.NO_ENTRY_FOUND:
                setDisabled(true);
                setHint(t('toolbar.status.deleted.in.meantime'));
                setIsDeleted(true);
                break;
            case CODE.OK:
                result.actualDocument.verification = getVerificationWfOptionForStep(t, result.actualDocument.verification);
                setDoc(cloneDeep(result.actualDocument));
                setHint(t('toolbar.status.saved'));
                setUpdatedDoc(result.actualDocument);
                break;
            default:
                setErrorCode(result.code);
                setShowErrorView(true);
        }
    };

    return (
        <UserstoryViewPresenter
            status={hint}
            doc={doc} setDoc={setDoc}
            updateDoc={updateDoc}
            areInputsValid={areInputsValid}
            errorName={errorName} errorDescription={errorDescription}
            errorCode={errorCode} setErrorCode={setErrorCode}
            showErrorView={showErrorView} setShowErrorView={setShowErrorView}
            verificationWfOptions={verificationWfOptions}
            onClickHome={onClickHome}
            onBack={onBack}
            disabled={disabled}
            hint={hint}
            storypoints={storypoints}
            setStorypoints={setStorypoints}
            onClose={onClose}
        >
        </UserstoryViewPresenter>
    );
}
