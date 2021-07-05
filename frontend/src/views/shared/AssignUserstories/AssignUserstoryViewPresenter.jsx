/**
 * @module AssignUserstoryViewPresenter
 *
 * @description
 * Presenter part of dialog to assign userstories
 *
 * @author Hans-Peter Görg
 **/

import React from 'react';
import {Layer, Box, DataTable, Button, Heading, Text} from 'grommet';
import {BarChart, FormCheckmark, LinkNext, LinkPrevious} from "grommet-icons";
import UserstoryViewContainer from "../../Userstory/UserstoryViewContainer";
import DataChartViewStorypoints from "../DataChartViewStorypoints";
import {useTranslation} from "react-i18next";
import Tooltip from "react-tooltip-lite";
import {TOOLTIP_COLOR} from "../../../configTheme";


export default function AssignUserstoryViewPresenter({
                                                         title,
                                                         onOK, onClickAssign, onClickUnAssign,
                                                         columnsAssigned, columnsNotAssigned,
                                                         docsAssigned, docsNotAssigned,
                                                         checkedAssigned, checkedNotAssigned,
                                                         sortByName, setSortByName,
                                                         sortByWf, setSortByWf,

                                                         showDataChart, setShowDataChart, onClickDataChart, dataForDataChart,
                                                         showEditUserstory,
                                                         updateDoc, onCloseUserstory,
                                                         onClose
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

                <Box direction={"row"} alignSelf={"center"} argin={{bottom: "medium"}}>
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
                                search: col.property === 'name'
                            }))}
                            data={docsNotAssigned}
                            sort={sortByName}
                            onSort={setSortByName}
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
                                search: col.property === 'name'
                            }))}
                            data={docsAssigned}
                            sort={sortByWf}
                            onSort={setSortByWf}
                            size={"medium"}
                            step={docsAssigned.length}
                        >
                        </DataTable>
                    </Box>
                </Box>
                <Box direction={"row"}>
                    <Tooltip content={t('general.accept.and.back')} direction={"left"} color={TOOLTIP_COLOR}
                             arrow={false}>
                        <Button color={"brand"} primary icon={<FormCheckmark size={"medium"}/>}
                                margin={{top: "medium", left: "medium"}}
                                onClick={onOK}
                        >
                        </Button>
                    </Tooltip>

                    {docsAssigned.length > 0 &&
                    <Tooltip content={t('datachart.help')} direction={"right"} color={TOOLTIP_COLOR} arrow={false}>
                        <Button color={"brand"} primary icon={<BarChart size={"medium"}/>}
                                margin={{top: "medium", left: "medium"}}
                                onClick={onClickDataChart}
                        >
                        </Button>
                    </Tooltip>
                    }
                </Box>
            </Box>

            {showEditUserstory &&
            <UserstoryViewContainer
                docToUpdate={updateDoc}
                onCloseUserstory={onCloseUserstory}>
            </UserstoryViewContainer>
            }

            {showDataChart &&
            <DataChartViewStorypoints
                setShowMe={setShowDataChart}
                data={dataForDataChart}
            >
            </DataChartViewStorypoints>
            }
        </Layer>
    );
}
