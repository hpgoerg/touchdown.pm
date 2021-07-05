/**
 * @module StorypointsEditorView
 *
 * @description
 * View to edit storypoints.
 * As recommended by scrum authors, the following fibonacci values can be given:
 *      1, 2, 3, 5, 8, 13, 21
 *
 * @author Hans-Peter Görg
 **/
import React from 'react';

import { Box, Button, Grommet, RangeInput, Text } from 'grommet';

import { Add, Subtract } from 'grommet-icons';
import {deepMerge} from "grommet/utils";
import {THEME} from "../../../configTheme";

const STORYPOINT_THEME = deepMerge(THEME, {
    rangeInput: {
        track: {
            height: '10px',
            lower: {
                color: 'brand',
                opacity: 0.7,
            },
            upper: {
                color: 'dark-4',
                opacity: 0.3,
            },
        },
    },
});



export default function StorypointsEditorView({storypoints, setStorypoints}) {


    const [addDisabled, setAddDisabled] = React.useState(storypoints === 21);
    const [subtractDisabled, setSubtractDisabled] = React.useState(storypoints === 1);

    const getPrevious = () => {
        setAddDisabled(false);

        switch(storypoints) {
            case 2:
                setSubtractDisabled(true);
                setStorypoints(1);
                break;
            case 3:
                setStorypoints(2);
                break;
            case 5:
                setStorypoints(3);
                break;
            case 8:
                setStorypoints(5);
                break;
            case 13:
                setStorypoints(8);
                break;
            default: //21
                setStorypoints(13);
        }
    };

    const getNext = () => {
        setSubtractDisabled(false);

        switch(storypoints) {
            case 1:
                setStorypoints(2);
                break;
            case 2:
                setStorypoints(3)
                break;
            case 3:
                setStorypoints(5);
                break;
            case 5:
                setStorypoints(7);
                break;
            case 8:
                setStorypoints(13);
                break;
            default: //13
                setAddDisabled(true);
                setStorypoints(21);
                break;
        }
    };

    const onChange = event => setStorypoints(event.target.value);

    return (
        <Grommet theme={STORYPOINT_THEME}>
            <Box direction="row" align="center" pad="small" gap="small">
                <Text margin={{left: "small", right: "medium"}}>{storypoints}</Text>
                <Button
                    plain={false}
                    disabled={subtractDisabled}
                    icon={<Subtract color="neutral-2" size={"small"}/>}
                    onClick={getPrevious}
                />
                <Box align="center" width="medium">
                    <RangeInput
                        min={1}
                        max={21}
                        value={storypoints}
                        onChange={onChange}
                        disabled={true}
                    />
                </Box>
                <Button
                    plain={false}
                    disabled={addDisabled}
                    icon={<Add color="neutral-2" size={"small"}/>}
                    onClick={getNext}
                />
            </Box>
        </Grommet>
    );
};