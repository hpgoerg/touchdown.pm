/**
 * @module HelpViewContainer
 *
 * @description
 * Container part of the help view
 *
 * @author Hans-Peter Görg
 **/
import React, {useState} from "react";

import {
    Grommet,

} from "grommet";
import {startsWith} from 'lodash';
import {getUserLocale} from "get-user-locale";

import {useTranslation} from "react-i18next";
import {helpEn} from "../../i18n/locales/HelpEn";
import {helpDe} from "../../i18n/locales/HelpDe";
import {getHelpContextId, setHelpContextId} from "./HelpContext";
import {HELP_CONTEXT_ID} from "../../shared/constants/enums";
import HelpViewPresenter from "./HelpViewPresenter";
import {THEME} from "../../configTheme";


export default function HelpViewContainer({onCloseHelp}) {

    const {t} = useTranslation();
    const locale = getUserLocale();


    const getHelpSelect = () => {
        let options = [];

        Object.getOwnPropertyNames(HELP_CONTEXT_ID).forEach( (value) => {
            let anOption = t('help.'+ value.toLowerCase());

            options.push( {labelKey: t(anOption), valueKey: value});
        });

        return {
            options: options,
            value: {labelKey: t('help.' + getHelpContextId()), valueKey: getHelpContextId()}
        }
    };


    const getHelpText = () => {
        if (startsWith(locale, 'de')) {
            return helpDe[getHelpContextId()];
        } else {
            return helpEn[getHelpContextId()];
        }
    };

    const [helpText, setHelpText] = useState(getHelpText);
    const [helpSelect, setHelpSelect] = useState(getHelpSelect);


    const onHelpChange = (e) => {
        e.preventDefault();

        let newHelpSelect = getHelpSelect();
        newHelpSelect.value = e.value;
        setHelpSelect(newHelpSelect);

        setHelpContextId(newHelpSelect.value.valueKey);
        setHelpText(getHelpText());
    }

    return (
        <Grommet theme={THEME}>
           <HelpViewPresenter
               onCloseHelp={onCloseHelp}
               helpText={helpText}
               helpSelect={helpSelect}
               onHelpChange={onHelpChange}
           >
           </HelpViewPresenter>
        </Grommet>
    );
}
