/**
 * @module UserstoryViewPresenter
 *
 * @description
 * Presenter part of the dialog to edit a given userstory
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
    Select,
    Layer, Heading, Card, CardHeader, CardBody, CardFooter
} from 'grommet';
import {useTranslation} from "react-i18next";

import StarRatings from 'react-star-ratings';

import ErrorView from "../shared/ErrorView";
import {THEME} from "../../configTheme";
import StorypointsEditorView from "../shared/Storypoints/StorypointsEditorView";


export default function UserstoryViewPresenter(
    {
        doc, setDoc, areInputsValid, errorName, errorDescription,
        updateDoc,
        errorCode, showErrorView,
        verificationWfOptions,
        onClickHome, onBack,
        disabled, hint,
        storypoints, setStorypoints,
        onClose
    }) {

    const {t} = useTranslation();

    const [priority, setPriority] = useState(doc.priority);

    const changePriority = (newPriority, _) => {
        setPriority(newPriority);
    }

    useEffect(() => {
        setPriority(doc.priority);
    }, [doc.priority]);

    return (
        <Grommet theme={THEME}>

            {!showErrorView &&
            <Layer
                onEsc={onClose}
                onClickOutside={onClose}
            >
                <Card height={{min: "80vh", max: "80vh"}}
                      width={{min: "50vh"}}
                      overflow={{vertical: 'scroll'}}
                      border={{size: "medium", color: "brand"}}
                      round={false}
                      background={"light-1"}
                >
                    <CardHeader pad="small" alignSelf={"center"}>
                        <Heading level={3} color={"brand"}>
                            {t('userstories.view.title.update.one')}
                        </Heading>
                    </CardHeader>

                    <CardBody>
                        <Grid align="stretch"
                              areas={[                    //column, row
                                  {name: 'left', start: [0, 1], end: [0, 1]},
                                  {name: 'content', start: [1, 1], end: [1, 1]},
                                  {name: 'right', start: [2, 1], end: [2, 1]},
                              ]}
                              columns={['auto', 'xlarge', 'auto']}
                              rows={['xxsmall', 'large']}
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
                                            await updateDoc(event.value);
                                        }
                                    }}
                                >
                                    <Box direction={"row"}>
                                        <Box direction={"column"} width={"large"}>

                                            <FormField htmlfor="name" label={t('userstories.view.name')}
                                                       error={errorName}
                                                       name={"name"}
                                            >
                                                <TextInput id="name" name="name" disabled={disabled}/>
                                            </FormField>

                                            <FormField htmlFor={"description"} name={"description"}
                                                       label={t('userstories.view.description')}
                                                       error={errorDescription}
                                            >
                                                <TextArea name="description" id={"description"} size={"medium"}
                                                          disabled={disabled}>
                                                </TextArea>
                                            </FormField>

                                            <FormField htmlFor={"storypoints"} name={"storypoints"}
                                                       label={t('userstories.view.storypoints')}
                                            >
                                                <Box direction={"row"} alignSelf={"center"} margin={{top: "medium"}}>
                                                    <Text size={"xsmall"}
                                                          color={"brand"}>{t('userstories.view.storypoints.hint')}</Text>
                                                </Box>
                                                <StorypointsEditorView
                                                    storypoints={storypoints}
                                                    setStorypoints={setStorypoints}
                                                >
                                                </StorypointsEditorView>

                                            </FormField>

                                        </Box>


                                        <Box direction={"column"} width={"small"}></Box>

                                        <Box direction={"column"} width={"medium"}>

                                            <FormField htmlFor={"priority"} name={"priority"}
                                                       label={t('userstories.view.priority')}
                                                       margin={{bottom: "medium"}}
                                            >
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

                                            <Text alignSelf={"start"}
                                                  margin={{top: "small", left: "small", bottom: "small"}}
                                                  color="brand">{t('userstories.view.workflow.status')}</Text>

                                            <Select name={"verification"} id={"verification"} dropAlign={{top: "top"}}
                                                    options={verificationWfOptions}
                                                    labelKey={"labelKey"}
                                                    valueKey={"valueKey"}
                                                    disabled={disabled}>
                                            </Select>

                                        </Box>

                                    </Box>

                                    <Box direction={"row"} gap={"large"} margin={{top: "medium"}}>
                                        <Box direction={"column"}>
                                            <Button type={"submit"} primary label={t('general.submit')}
                                                    name="save"
                                                    id={"save"}
                                                    disabled={disabled}/>
                                        </Box>
                                        <Box direction={"column"}>
                                            <Button secondary
                                                    label={t('general.back')}
                                                    onClick={onBack}
                                            >
                                            </Button>
                                        </Box>
                                    </Box>

                                </Form>
                            </Box>

                            <Box gridArea='right'/>

                        </Grid>
                    </CardBody>
                    <CardFooter alignSelf={"center"} margin={{bottom: "medium"}}>
                        <Text weight={"bold"}>{hint}</Text>
                    </CardFooter>
                </Card>
            </Layer>
            }

            {showErrorView &&
            <ErrorView handleClose={onClickHome} errorCode={errorCode}></ErrorView>
            }

        </Grommet>
    );
}
