/**
 * @module HelpViewPresenter
 *
 * @description
 * Presenter part of the help view
 *
 * @author Hans-Peter Görg
 **/
import React from "react";

import {
    Box,
    Heading,
    Markdown,
    Layer,
    Button, Select
} from "grommet";
import {Close} from 'grommet-icons';

import {useTranslation} from "react-i18next";

export default function HelpViewPresenter({onCloseHelp, helpText, helpSelect, onHelpChange}) {

    const {t} = useTranslation();

    return (
            <Layer
                onEsc={onCloseHelp}
                onClickOutside={onCloseHelp}
            >

                <Box align={"center"}
                     size={{minWidth: "30vh", maxWidth: "30vh"}}
                     border={{size: "medium", color: "brand"}}
                     background={"light-1"}
                >

                    <Heading level={3} margin={"medium"} color={"brand"}>{t('help.title')}</Heading>

                    <Select name={"helpContextId"} id={"helpContextId"} margin={{bottom: "medium"}}
                            options={helpSelect.options}
                            value={helpSelect.value}
                            labelKey={"labelKey"}
                            valueKey={"valueKey"}
                            onChange={onHelpChange}
                    >
                    </Select>

                    <Box direction={"row"}  margin={{left: "small", right: "small"}}>
                        <Markdown>{helpText}</Markdown>
                    </Box>

                    <Box direction={"row"} overflow={"auto"}>
                        <Button secondary icon={<Close size={"medium"}/>} margin={{top: "medium"}}
                                onClick={onCloseHelp}
                        >
                        </Button>
                    </Box>

                </Box>

            </Layer>
    );
}
