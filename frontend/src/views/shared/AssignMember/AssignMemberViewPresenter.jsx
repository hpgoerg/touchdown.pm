/**
 * @module AssignMemberViewPresenter
 *
 * @description
 * Presenter part of dialog to assign members
 *
 * @author Hans-Peter Görg
 **/

import React from 'react';
import {Layer, Box, DataTable, Button, Heading, Text} from 'grommet';
import {FormCheckmark, LinkNext, LinkPrevious} from "grommet-icons";
import {useTranslation} from "react-i18next";
import Tooltip from "react-tooltip-lite";
import {TOOLTIP_COLOR} from "../../../configTheme";


export default function AssignMemberViewPresenter({
                                                      title, searchField,
                                                      onOK, onClickAssign, onClickUnAssign,
                                                      columnsAssigned, columnsNotAssigned,
                                                      docsAssigned, docsNotAssigned,
                                                      checkedAssigned, checkedNotAssigned,
                                                      sort, setSort, onClose
                                                  }) {

    const {t} = useTranslation();

    return (
        <Layer
            onEsc={onClose}
            onClickOutside={onClose}
        >
            <Box align={"center"}
                 pad={"small"}
                 border={{size: "medium", color: "brand"}}
                 round={false}
                 background={"light-1"}
            >

                <Box direction={"row"} alignSelf={"center"} margin={{bottom: "medium"}}>
                    <Heading level={3} margin={"medium"} color={"brand"}>{title}</Heading>
                </Box>

                <Box direction={"row"} alignSelf={"center"} margin={{bottom: "small"}}>
                    <Text size={"xsmall"} color={"brand"}>{t('general.header.hint')}</Text>
                </Box>
                <Box direction={"row"}>
                    <Box direction={"column"} width={{min: "60vh", max: "60vh"}}>
                        <DataTable
                            columns={columnsNotAssigned.map(col => ({
                                ...col,
                                search: col.property === searchField
                            }))}
                            data={docsNotAssigned}
                            sort={sort}
                            onSort={setSort}
                            size={"medium"}
                            step={docsNotAssigned.length}
                        >
                        </DataTable>
                    </Box>
                    <Box direction={"column"} width={"small"} align={"center"}>
                        <Button plain={false} secondary icon={<LinkNext size={"medium"}/>} margin={{top: "large"}}
                                disabled={checkedNotAssigned.length === 0}
                                onClick={onClickAssign}
                        >
                        </Button>
                        <Button plain={false} secondary icon={<LinkPrevious size={"medium"}/>} margin={{top: "medium"}}
                                disabled={checkedAssigned.length === 0}
                                onClick={onClickUnAssign}
                        >
                        </Button>
                    </Box>
                    <Box direction={"column"} width={{min: "60vh", max: "60vh"}}>
                        <DataTable
                            columns={columnsAssigned.map(col => ({
                                ...col,
                                search: col.property === searchField
                            }))}
                            data={docsAssigned}
                            sort={sort}
                            onSort={setSort}
                            size={"medium"}
                            step={docsAssigned.length}
                        >
                        </DataTable>
                    </Box>
                </Box>
                <Box direction={"row"}>
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
