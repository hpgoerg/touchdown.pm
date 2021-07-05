/**
 * @module DataChartViewStorypoints
 *
 *
 * @description
 * Shows a data chart of storypoints aggregated by verification workflow status
 *
 * @author Hans-Peter Görg
 **/

import React from 'react';
import {Layer, Button, Heading, DataChart, Box, Text} from 'grommet';
import {Close} from "grommet-icons";
import {useTranslation} from "react-i18next";


export default function DataChartViewStorypoints({setShowMe, data}) {

    const {t} = useTranslation();

    const onClose = (e) => {
        e.stopPropagation();

        setShowMe(false);
    };

    return (
        <Layer
            onEsc={onClose}
            onClickOutside={onClose}>
            <Box
                border={{size: "medium", color: "brand"}}
                round={false}
                background={"light-1"}
            >
                <Box direction={"row"} alignSelf={"center"} margin={{bottom: "medium"}}>
                    <Heading level={3} margin={"medium"} color={"brand"}>{t('datachart.title')}</Heading>
                </Box>
                <Box direction={"row"} alignSelf={"center"} margin={{bottom: "small"}}>
                    <Text size={"xsmall"} color={"brand"}>{t('datachart.hint')}</Text>
                </Box>
                <Box direction={"row"} full={true}
                     margin={{left: "small", right: "small"}} alignSelf={"center"}>
                    <DataChart
                        alignSelf={"stretch"}
                        series={[
                            {
                                property: 'workflowStatus',
                                render: value => (
                                    <Text size={"xsmall"}>
                                        {value}
                                    </Text>
                                ),
                            },
                            'storypoints']}
                        data={data}

                        axis={{
                            x: {property: 'workflowStatus', granularity: 'fine'},
                            y: {property: 'storypoints', granularity: 'medium'},
                        }}
                        detail={true}
                        bounds={"align"}
                        gap={"large"}
                    >
                    </DataChart>
                </Box>
                <Box direction={"row"} alignSelf={"center"} margin={{top: "large", bottom: "medium"}}>
                    <Button secondary icon={<Close size={"medium"}/>} margin={{top: "medium"}}
                            onClick={onClose}
                    >
                    </Button>
                </Box>
            </Box>

        </Layer>
    );
}
