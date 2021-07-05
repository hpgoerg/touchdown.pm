/**
 * @module ReleasesViewContainer
 *
 * @description
 * Container part of the view to edit releases
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
import ReleasesViewPresenter from "./ReleasesViewPresenter";
import {extendedTrim, hasContent} from "../../shared/util/generalUtils";
import {setHelpContextId} from "../Help/HelpContext";
import {HELP_CONTEXT_ID} from "../../shared/constants/enums";


export default function ReleasesViewContainer() {
    const {t} = useTranslation();
    setHelpContextId(HELP_CONTEXT_ID.RELEASE);

    const DUMMY_NEW_ID = 'NEW';

    const history = useHistory();

    const newDoc = {
        _id: DUMMY_NEW_ID,
        version: 1,
        name: '',
        releasenr: '0.0.0.0',
        launchdate: moment().add(28, 'days').toDate(),
        userstories: [],
        launched: false
    };


    const [errorCode, setErrorCode] = useState(CODE.OK);
    const [showErrorView, setShowErrorView] = useState(false);
    const [doc, setDoc] = useState(newDoc);
    const [launchdate, setLaunchdate] = useState(newDoc.launchdate);
    const [showSearch, setShowSearch] = useState(false);
    const [deletable, setDeletable] = useState(false);
    const [errorName, setErrorName] = useState('');
    const [errorReleasenr, setErrorReleasenr] = useState('');
    const [status, setStatus] = useState('');
    const [userstories, setUserstories] = useState(newDoc.userstories);
    const [showUserstories, setShowUserstories] = useState(false);

    const clearValidationErrors = (clearStatus) => {
        setErrorName('');
        setErrorReleasenr('');
        if(clearStatus) {
            setStatus('');
        }
    };

    const onSelectDoc = (selectedDoc) => {
        clearValidationErrors(true);
        setDoc(selectedDoc);
        setLaunchdate(selectedDoc.launchdate);
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
        setLaunchdate(newDoc.launchdate);
        setUserstories([]);
        setDeletable(false);
    };

    const areInputsValid = (value) => {
        clearValidationErrors(true);
        let valid = true;

        value.name = extendedTrim(value.name, false);
        if (! hasContent(value.name)) {
            setErrorName(t('general.error.name.required'));
            valid = false;
        }

        value.releasenr = extendedTrim(value.releasenr, false);
        if (! hasContent(value.releasenr)) {
            setErrorReleasenr(t('releases.view.releasenr.unique.required'));
            valid = false;
        }

        return valid;
    };

    const onClickDelete = async () => {
        clearValidationErrors(true);

        const result = await restDelete('release', doc._id, doc.version);

        switch (result.code) {

            case CODE.WRONG_VERSION:
                setStatus(t('toolbar.status.changed.in.meantime'));
                setDoc(result.actualDocument);
                setLaunchdate(result.actualDocument.launchdate);
                setUserstories(result.actualDocument.userstories);
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
        const result = await restPutUpdate('release', value);

        switch (result.code) {

            case CODE.DUPLICATE_KEY:
                setStatus(t('toolbar.status.dupkey.releasenr'))
                setErrorReleasenr(t('releases.view.releasenr.unique.required'));
                break;
            case CODE.WRONG_VERSION:
                setStatus(t('toolbar.status.changed.in.meantime'));
                setDoc(result.actualDocument);
                setLaunchdate(result.actualDocument.launchdate);
                setUserstories(result.actualDocument.userstories);
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
    };


    const createDoc = async (value) => {
        const result = await restPostCreate('release', value);

        switch (result.code) {

            case CODE.DUPLICATE_KEY:
                setStatus(t('toolbar.status.dupkey.releasenr'))
                setErrorReleasenr(t('releases.view.releasenr.unique.required'));
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
        <ReleasesViewPresenter
            status={status}
            doc={doc}
            setDoc={setDoc}
            areInputsValid={areInputsValid}
            createDoc={createDoc}
            updateDoc={updateDoc}
            setShowSearch={setShowSearch}
            errorName={errorName}
            errorReleasenr={errorReleasenr}
            launchdate={launchdate}
            setLaunchdate={setLaunchdate}
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
        >
        </ReleasesViewPresenter>
    );
}
