/**
 * @module UserstoriesViewPresenter
 *
 * @description
 * Presenter part of the view to edit userstories
 *
 * @author Hans-Peter Görg
 **/
import React, {useEffect, useState} from 'react';

import {
    Grommet,
    Form,
    FormField,
    TextInput,
    TextArea,
    Box,
    Button,
    Grid,
    Text,
    Select
} from 'grommet';
import {Search} from 'grommet-icons';
import {useTranslation} from "react-i18next";

import StarRatings from 'react-star-ratings';

import ToolbarView from "../Toolbar/ToolbarView";
import ErrorView from "../shared/ErrorView";
import SearchView from "../shared/SearchView";
import Tooltip from "react-tooltip-lite";
import {THEME, TOOLTIP_COLOR} from "../../configTheme";
import StorypointsEditorView from "../shared/Storypoints/StorypointsEditorView";


export default function UserstoriesViewPresenter(
    {
        status, doc, setDoc, areInputsValid, createDoc, updateDoc, setShowSearch, errorName, errorDescription,
        onClickNew, deletable, onClickDelete,
        onClickHome, errorCode, showErrorView, setErrorCode, setShowErrorView, onSelectDoc, showSearch,
        verificationWfOptions,
        storypoints, setStorypoints
    }) {

    const {t} = useTranslation();
    const DUMMY_NEW_ID = 'NEW';

    const [priority, setPriority] = useState(doc.priority);

    const changePriority = (newPriority, _) => {
        setPriority(newPriority);
    };

    useEffect(() => {
        setPriority(doc.priority);
    }, [doc.priority]);

    return (
        <Grommet theme={THEME}>

            <ToolbarView status={status} subject={t('userstories.view.title')}></ToolbarView>

            {!showErrorView &&
            <Grid align="stretch"
                  areas={[                    //column, row
                      {name: 'left', start: [0, 1], end: [0, 1]},
                      {name: 'content', start: [1, 1], end: [1, 1]},
                      {name: 'right', start: [2, 1], end: [2, 1]},
                  ]}
                  columns={['auto', 'xlarge', 'auto']}
                  rows={['xxsmall', 'medium']}
                  gap='small'
            >
                <Box gridArea='left'></Box>

                <Box gridArea="content">
                    <Form
                        value={doc}
                        onChange={nextValue => {
                            setDoc(nextValue);
                        }
                        }
                        onSubmit={async (event) => {
                            event.value.priority = priority;
                            event.value.storypoints = storypoints;

                            let isValid = areInputsValid(event.value);
                            if (isValid) {
                                if (event.value._id === DUMMY_NEW_ID) {
                                    await createDoc(event.value);
                                } else {
                                    await updateDoc(event.value);
                                }
                            }
                        }}
                    >
                        <Box direction={"row"}>
                            <Box direction={"column"} width={"large"}>

                                <Box direction="row" gap={"xlarge"} margin={{bottom: "large"}}>
                                    <Tooltip content={t('userstories.view.search.title')} direction={"right"}
                                             color={TOOLTIP_COLOR} arrow={false}>
                                        <Button primary
                                                onClick={() => setShowSearch(true)}
                                                icon={<Search size={'medium'}></Search>}
                                        >
                                        </Button>
                                    </Tooltip>
                                </Box>


                                <FormField htmlfor="name" label={t('userstories.view.name')} error={errorName}
                                           name={"name"}>
                                    <TextInput id="name" name="name"/>
                                </FormField>

                                <FormField htmlFor={"description"} name={"description"}
                                           label={t('userstories.view.description')} error={errorDescription}>
                                    <TextArea name="description" id={"description"} size={"medium"}>
                                    </TextArea>
                                </FormField>

                                <FormField htmlFor={"storypoints"} name={"storypoints"}
                                           label={t('userstories.view.storypoints')}
                                >
                                    <Box direction={"row"} alignSelf={"center"} margin={{top: "medium"}}>
                                        <Text size={"xsmall"} color={"brand"}>{t('userstories.view.storypoints.hint')}</Text>
                                    </Box>
                                    <StorypointsEditorView
                                        storypoints={storypoints}
                                        setStorypoints={setStorypoints}
                                    >
                                    </StorypointsEditorView>
                                </FormField>

                                <Box direction={"row"} gap={"large"} margin={{top: "large"}}>
                                    <Box direction={"column"}>
                                        <Button type={"submit"} primary label={t('general.submit')} name="save" id={"save"}/>
                                    </Box>

                                    <Box direction={"column"}>
                                        <Button secondary label={t('general.new')} name={"new"} id={"new"}
                                                onClick={onClickNew}>
                                        </Button>
                                    </Box>

                                    <Box direction={"column"}>
                                        <Button secondary label={t('general.delete')} name={"delete"} id={"delete"}
                                                disabled={!deletable} onClick={onClickDelete}/>
                                    </Box>
                                </Box>
                            </Box>


                            <Box direction={"column"} width={"small"}></Box>

                            <Box direction={"column"} width={"medium"} margin={{top: "large"}}>

                                <FormField htmlFor={"priority"} name={"priority"}
                                           label={t('userstories.view.priority')}
                                           margin={{top: "large", bottom: "medium"}}>

                                    <StarRatings
                                        rating={priority}
                                        changeRating={changePriority}
                                        numberOfStars={5}
                                        name='priority'
                                        starDimension={"25px"}
                                        starSpacing={"1px"}
                                        starRatedColor={"gold"}
                                        starHoverColor={"gold"}
                                    />

                                </FormField>

                                <Text alignSelf={"start"} margin={{top: "small", left: "small", bottom: "small"}}
                                      color="brand">{t('userstories.view.workflow.status')}</Text>

                                <Select name={"verification"} id={"verification"} dropAlign={{top: "top"}}
                                        options={verificationWfOptions}
                                        labelKey={"labelKey"}
                                        valueKey={"valueKey"}
                                >
                                </Select>

                            </Box>
                        </Box>
                    </Form>
                </Box>

                <Box gridArea='right'/>

            </Grid>
            }

            {showSearch &&
            <SearchView
                subject={"userstory"}
                column={"name"}
                header={t('userstories.view.name')}
                title={t('userstories.view.search.title')}
                setShowSearch={setShowSearch}
                setErrorCode={setErrorCode}
                setShowErrorView={setShowErrorView}
                onSelectDoc={onSelectDoc}>
            </SearchView>
            }

            {showErrorView &&
            <ErrorView handleClose={onClickHome} errorCode={errorCode}></ErrorView>
            }

        </Grommet>
    );
}
