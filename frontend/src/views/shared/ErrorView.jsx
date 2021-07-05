/**
 * @module ErrorView
 *
 * @description
 * View dialog to show a critical error
 *
 * @author Hans-Peter Görg
 **/
import React, {useEffect, useState} from 'react';
import {Box, Button, Heading, Layer, Paragraph} from 'grommet';

import {useTranslation} from "react-i18next";
import {useHistory} from 'react-router-dom';
import {CODE} from "../../shared/constants/code";
import {isAuthorizationErrorCode} from "../../shared/util/generalUtils";
import {logout} from "../../action/actionLogout";


export default function ErrorView({errorCode}) {
    const {t} = useTranslation();
    const [title, setTitle] = useState('');
    const [errorHint, setErrorHint] = useState('');
    const history = useHistory();

    useEffect(() => {
            if (isAuthorizationErrorCode(errorCode)) {
                setTitle(t('error.title.authorization'));
               if (errorCode === CODE.TOKEN_EXPIRED) {
                   setErrorHint(t('error.token.expired'));
               }
               if(errorCode === CODE.FORCED_LOGOUT) {
                   setErrorHint(t('error.account.probably.deleted'));
               }
            } else {
                setTitle(t('error.title.technical'));
                setErrorHint(t('error.try.later.technical.error'));
            }
        }, [title, errorCode, t]
    );


    const onClose = () => {
        logout();
        history.push("/");
    }

    return (

        <Layer
            onEsc={onClose}
            onClickOutside={onClose}
            modal={true}
        >
            <Box
                border={{size: "medium", color: "brand"}}
                round={false}
                background={"light-1"}
            >
                <Heading level={3} margin={"medium"} color={"brand"}>{title}</Heading>
                <Paragraph margin={{top: "medium", bottom: "large", left: "small"}} alignSelf={"center"}>
                    {errorHint}
                </Paragraph>

                <Box direction={"column"}>
                    <Button label={t('ok')} onClick={onClose} primary alignSelf={"center"} margin={{bottom: "medium"}}/>
                </Box>
            </Box>
        </Layer>
    );
}
