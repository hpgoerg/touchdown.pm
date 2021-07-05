/**
 * @module MembersViewContainer
 *
 * @description
 * Container part of the view to edit members
 *
 * Hint: only members with ROLE.ADMIN are allowed to edit members
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
import {HELP_CONTEXT_ID, ROLE} from "../../shared/constants/enums";
import MembersViewPresenter from "./MembersViewPresenter";
import {checkEmail, checkPassword} from "../../shared/util/checks";
import {extendedTrim, hasContent} from "../../shared/util/generalUtils";
import {setHelpContextId} from "../Help/HelpContext";
import {getAccount} from "../../model/account";


export default function MembersViewContainer() {
    const {t} = useTranslation();
    setHelpContextId(HELP_CONTEXT_ID.MEMBER);

    const DUMMY_NEW_ID = 'NEW';

    const history = useHistory();

    const newDoc = {
        _id: DUMMY_NEW_ID,
        version: 1,
        name: '',
        firstname: '',
        email: '',
        password: '',
        role: ROLE.SCRUMTEAMMEMBER
    };

    const [errorCode, setErrorCode] = useState(CODE.OK);
    const [showErrorView, setShowErrorView] = useState(false);
    const [doc, setDoc] = useState(newDoc);
    const [showSearch, setShowSearch] = useState(false);
    const [deletable, setDeletable] = useState(false);
    const [errorName, setErrorName] = useState('');
    const [errorFirstname, setErrorErrorFirstname] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [status, setStatus] = useState('');

    const clearValidationErrors = (clearStatus) => {
        setErrorName('');
        setErrorErrorFirstname('');
        setErrorEmail('');
        setErrorPassword('');
        if(clearStatus) {
            setStatus('');
        }
    };

    const onSelectDoc = (selectedDoc) => {
        clearValidationErrors(true);
        setDoc(selectedDoc);

        if(selectedDoc._id !== getAccount()._id) {
            setDeletable(true);
        } else {
            //you cannot delete your own account
            setDeletable(false);
        }
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
    };

    const areInputsValid = (value) => {
        clearValidationErrors(true);
        let valid = true;

        value.name = extendedTrim(value.name, false);
        if (! hasContent(value.name)) {
            setErrorName(t('general.error.name.required'));
            valid = false;
        }

        value.firstname = extendedTrim(value.firstname, false);
        if (! hasContent(value.firstname)){
            setErrorErrorFirstname(t('general.error.firstname.required'));
            valid = false;
        }

        value.email = extendedTrim(value.email, true);
        if(! checkEmail(value.email)) {
            setErrorEmail(t('general.error.email.invalid'));
            valid = false;
        }

        if(value._id === DUMMY_NEW_ID) {
            if (! checkPassword(value.password)) {
                setErrorPassword(t('general.error.password.required'));
                valid = false;
            }
        }

        if (!valid) {
            setDeletable(false);
        }

        return valid;
    };

    const onClickDelete = async () => {
        clearValidationErrors(true);

        const result = await restDelete('member', doc._id, doc.version);

        switch (result.code) {

            case CODE.WRONG_VERSION:
                setStatus(t('toolbar.status.changed.in.meantime'));
                setDoc(result.actualDocument);
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
        const result = await restPutUpdate('member', value);

        switch (result.code) {

            case CODE.DUPLICATE_KEY:
                setStatus(t('toolbar.status.dupkey.email'))
                setErrorEmail(t('general.error.email.required'));
                break;
            case CODE.WRONG_VERSION:
                setStatus(t('toolbar.status.changed.in.meantime'));
                setDoc(result.actualDocument);
                break;
            case CODE.NO_ENTRY_FOUND:
                setStatus(t('toolbar.status.deleted.in.meantime'));
                onClickNew(false);
                break;
            case CODE.OK:
                setDoc(result.actualDocument);

                if(result.actualDocument._id === getAccount()._id) {
                    setStatus(t('members.view.changed.own.account'));
                } else {
                    setStatus(t('toolbar.status.saved'));
                }

                break;
            default:
                setErrorCode(result.code);
                setShowErrorView(true);
        }
    };


    const createDoc = async (value) => {
        clearValidationErrors(true);
        const result = await restPostCreate('member', value);

        switch (result.code) {

            case CODE.INVALID_PASSWORD:
                setErrorPassword(t('general.error.password.required'));
                break;
            case CODE.DUPLICATE_KEY:
                setStatus(t('toolbar.status.dupkey.email'))
                setErrorEmail(t('general.error.email.required'));
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
        <MembersViewPresenter
            status={status}
            doc={doc} setDoc={setDoc}
            areInputsValid={areInputsValid}
            createDoc={createDoc}
            updateDoc={updateDoc}
            setShowSearch={setShowSearch}
            errorName={errorName}
            errorFirstname={errorFirstname}
            errorEmail={errorEmail}
            errorPassword={errorPassword}
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
        >
        </MembersViewPresenter>
    );
}
