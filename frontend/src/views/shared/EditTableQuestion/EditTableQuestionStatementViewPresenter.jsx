/**
 * @module EditTableQuestionStatementViewPresenter
 *
 * @description
 * Presenter part of the view dialog component to edit question - answer scenarios
 *
 * @author Hans-Peter Görg
 **/
import React from 'react';
import {Box, DataTable, Text, TextInput, Button, Grommet, Heading, Layer, Keyboard} from 'grommet';
import {Close, Checkmark, FormCheckmark} from "grommet-icons";
import {useTranslation} from "react-i18next";
import Tooltip from "react-tooltip-lite";
import {TOOLTIP_COLOR} from "../../../configTheme";

export default function EditTableQuestionStatementViewPresenter(
    {
        title,
        ThemeEditTable, searchField, columns, data, sort, setSort,
        editDataQuestion, editDataStatement,
        onChangeDataEntryQuestion, onChangeDataEntryStatement,
        onClickEditEntry, onClickNewEntry,
        errorEditTable,
        onOK, onClose, editHint
    }
) {

    const {t} = useTranslation();

    return (
        <Layer
            onEsc={onClose}
            onClickOutside={onClose}
        >
            <Box
                border={{size: "medium", color: "brand"}}
                round={false}
                background={"light-1"}
            >
                <Box direction={"row"} alignSelf={"center"} margin={{bottom: "medium"}}>
                    <Heading level={3} margin={"medium"} color={"brand"} alignSelf={"center"}>{title}</Heading>
                </Box>
                <Box direction={"row"} alignSelf={"center"} margin={{bottom: "small"}}>
                    <Text size={"xsmall"}
                          color={"brand"}>{`${t('general.header.hint')}.  ${t('edittable.hint.question.statement')}.`}</Text>
                </Box>

                <Box align={"start"} pad={"medium"}>
                    <DataTable
                        columns={columns.map(col => ({
                            ...col,
                            search: col.property === searchField
                        }))}
                        data={data}
                        sort={sort}
                        onSort={setSort}
                        size={"medium"}
                    >
                    </DataTable>

                    <Box direction={"row"} margin={{top: "medium"}}>
                        <Text size={"small"} color={"brand"}>{editHint}</Text>
                    </Box>

                    <Box direction={"row"} size={"large"} margin={{top: "xxsmall"}}>
                        <Box direction={"column"} alignSelf={"start"} width={{min: "45vh", max: "45vh"}}>
                            <Text size={"small"} color={"brand"}>{t('edittable.title.question')}</Text>
                            <Grommet theme={ThemeEditTable}>
                                <Keyboard onEnter={onClickEditEntry} onEsc={onClickNewEntry}>
                                    <TextInput margin={{top: "medium"}} full
                                               name={"question"}
                                               id={"question"}
                                               value={editDataQuestion}
                                               onChange={onChangeDataEntryQuestion}
                                    >
                                    </TextInput>
                                </Keyboard>
                            </Grommet>
                        </Box>

                        <Box direction={"column"} alignSelf={"start"} margin={{left: "small"}}
                             width={{min: "45vh", max: "45vh"}}>
                            <Text size={"small"} color={"brand"}>{t('edittable.title.statement')}</Text>
                            <Grommet theme={ThemeEditTable}>
                                <Keyboard onEnter={onClickEditEntry} onEsc={onClickNewEntry}>
                                    <TextInput margin={{top: "medium"}} full
                                               name={"statement"}
                                               id={"statement"}
                                               value={editDataStatement}
                                               onChange={onChangeDataEntryStatement}
                                    >
                                    </TextInput>
                                </Keyboard>
                            </Grommet>
                        </Box>

                        <Box direction={"column"} margin={{left: "large"}} align={"center"}>
                            <Text size={"small"} color={"brand"}>{t('edittable.take')}</Text>
                            <Button
                                onClick={onClickEditEntry}
                                disabled={(editDataQuestion === '') || (editDataStatement === '')}
                                icon={<Checkmark size={"medium"} color={"brand"}></Checkmark>}
                            >
                            </Button>
                        </Box>
                        <Box direction={"column"}>
                            <Text size={"small"} color={"brand"} alignSelf={"center"}>{t('edittable.reset')}</Text>
                            <Button secondary
                                    onClick={onClickNewEntry}
                                    icon={<Close size={"medium"}></Close>}
                            >
                            </Button>
                        </Box>
                    </Box>

                    {(errorEditTable !== '') &&
                    <Box direction={"row"} size={"large"} margin={{top: "xxsmall"}}>
                        <Text size={"xsmall"} color={"red"}>{errorEditTable}</Text>
                    </Box>
                    }
                </Box>

                <Box direction={"row"} alignSelf={"center"} margin={{top: "medium", bottom: "small"}}>
                    <Tooltip content={t('general.accept.and.back')} direction={"right"} color={TOOLTIP_COLOR}
                             arrow={false}>
                        <Button color={"brand"} primary icon={<FormCheckmark size={"medium"}/>}
                                margin={{top: "medium", left: "medium"}}
                                onClick={onOK}
                        >
                        </Button>
                    </Tooltip>
                </Box>
            </Box>
        </Layer>
    );
}
