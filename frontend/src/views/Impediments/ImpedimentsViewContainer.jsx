/**
 * @module ImpedimentsViewContainer
 *
 * @description
 * Container part of the view to edit impediments
 *
 * @author Hans-Peter Görg
 **/
import React, {useState} from 'react';

import {useHistory} from 'react-router-dom';
import {useTranslation} from "react-i18next";


import {CODE} from "../../shared/constants/code";
import {logout} from "../../action/actionLogout";

import {restPostCreate} from "../../service/servicePostRest";
import {restPutUpdate} from "../../service/servicePutRest";
import {restDelete} from "../../service/serviceDeleteRest";
import ImpedimentsViewPresenter from "./ImpedimentsViewPresenter";
import {extendedTrim, hasContent} from "../../shared/util/generalUtils";
import {setHelpContextId} from "../Help/HelpContext";
import {HELP_CONTEXT_ID} from "../../shared/constants/enums";


export default function ImpedimentsViewContainer() {
    const {t} = useTranslation();
    setHelpContextId(HELP_CONTEXT_ID.IMPEDIMENT);

    const DUMMY_NEW_ID = 'NEW';

    const history = useHistory();

    const newDoc = {
        _id: DUMMY_NEW_ID,
        version: 1,
        name: '',
        description: '',
        measures: []
    };


    const [errorCode, setErrorCode] = useState(CODE.OK);
    const [showErrorView, setShowErrorView] = useState(false);
    const [doc, setDoc] = useState(newDoc);
    const [showSearch, setShowSearch] = useState(false);
    const [deletable, setDeletable] = useState(false);
    const [errorName, setErrorName] = useState('');
    const [errorDescription, setErrorDescription] = useState('');
    const [status, setStatus] = useState('');
    const [measures, setMeasures] = useState([]);
    const [resetMeasureEdit, setResetMeasureEdit] = useState(true);

    const clearValidationErrors = (clearStatus) => {
        setErrorName('');
        setErrorDescription('');
        if(clearStatus) {
            setStatus('');
        }

    };

    const onSelectDoc = (selectedDoc) => {
        clearValidationErrors(true);
        setDoc(selectedDoc);
        setMeasures(selectedDoc.measures);
        setDeletable(true);

        setResetMeasureEdit(true);
    };

    const onClickHome = (e) => {
        e.preventDefault();
        logout();
        history.push("/");
    };

    const onClickNew = (clearStatus) => {
        clearValidationErrors(clearStatus);
        setDoc(newDoc);
        setDeletable(false);
        setMeasures(newDoc.measures);
        setResetMeasureEdit(true);
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

        const result = await restDelete('impediment', doc._id, doc.version);

        switch (result.code) {

            case CODE.WRONG_VERSION:
                setStatus(t('toolbar.status.changed.in.meantime'));
                setDoc(result.actualDocument);
                setMeasures(result.actualDocument.measures);
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

        setResetMeasureEdit(true);
    };

    const updateDoc = async (value) => {
        clearValidationErrors(true);

        const result = await restPutUpdate('impediment', value);

        switch (result.code) {

            case CODE.DUPLICATE_KEY:
                setStatus(t('toolbar.status.dupkey.name'))
                setErrorName(t('general.error.name.required'));
                break;
            case CODE.WRONG_VERSION:
                setStatus(t('toolbar.status.changed.in.meantime'));
                setDoc(result.actualDocument);
                setMeasures(result.actualDocument.measures);
                break;
            case CODE.NO_ENTRY_FOUND:
                setStatus(t('toolbar.status.deleted.in.meantime'));
                onClickNew(false);
                break;
            case CODE.OK:
                setDoc(result.actualDocument);
                setStatus(t('toolbar.status.saved'));
                break;
            default:
                setErrorCode(result.code);
                setShowErrorView(true);
        }

        setResetMeasureEdit(true);
    };


    const createDoc = async (value) => {

        const result = await restPostCreate('impediment', value);

        switch (result.code) {

            case CODE.DUPLICATE_KEY:
                setStatus(t('toolbar.status.dupkey.name'))
                setErrorName(t('general.error.name.required'));
                break;
            case CODE.OK:
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
        <ImpedimentsViewPresenter
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
            measures={measures}
            setMeasures={setMeasures}
            resetMeasureEdit={resetMeasureEdit}
            setResetMeasureEdit={setResetMeasureEdit}
        >
        </ImpedimentsViewPresenter>
    );
}
