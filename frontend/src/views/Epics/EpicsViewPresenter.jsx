/**
 * @module EpicsViewPresenter
 *
 * @description
 * Presenter part of the view to edit epics
 *
 * @author Hans-Peter Görg
 **/
import React from 'react';

import {Grommet, Form, FormField, TextInput, TextArea, Box, Button, Grid, Text, Anchor, Select} from 'grommet';
import {Catalog} from 'grommet-icons';
import {Search} from 'grommet-icons';
import {useTranslation} from "react-i18next";

import DayPickerView from "../shared/DayPickerView";
import ToolbarView from "../Toolbar/ToolbarView";
import ErrorView from "../shared/ErrorView";
import SearchView from "../shared/SearchView";
import AssignUserstoryViewContainer from "../shared/AssignUserstories/AssignUserstoryViewContainer";
import Tooltip from "react-tooltip-lite";
import {THEME, TOOLTIP_COLOR} from "../../configTheme";


export default function EpicsViewPresenter(
    {
        status, doc, setDoc, areInputsValid, createDoc, updateDoc, setShowSearch, errorName, errorDescription,
        startdate, setStartdate, finishdate, setFinishdate, errorFinishdate, onClickNew, deletable, onClickDelete,
        onClickHome, errorCode, showErrorView, setErrorCode, setShowErrorView, onSelectDoc, showSearch,
        showUserstories, setShowUserstories, userstories, setUserstories,
        verificationWfOptions
    }) {

    const {t} = useTranslation();
    const DUMMY_NEW_ID = 'NEW';

    return (
        <Grommet theme={THEME}>

            <ToolbarView status={status} subject={t('epics.view.title')}></ToolbarView>

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
                            event.value.startdate = startdate;
                            event.value.finishdate = finishdate;
                            event.value.userstories = userstories;
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

                                <Box direction="row" gap={"xlarge"} margin={{bottom: "medium"}}>
                                    <Tooltip content={t('epics.view.search.title')} direction={"right"} color={TOOLTIP_COLOR} arrow={false}>
                                        <Button primary
                                                onClick={() => setShowSearch(true)}
                                                icon={<Search size={'medium'}></Search>}
                                        >
                                        </Button>
                                    </Tooltip>
                                </Box>

                                <Box direction={"row"} margin={{bottom: "small"}}>
                                    <Box direction={"column"} fill={true}>
                                    </Box>
                                    <Box direction={"column"} fill={true} align={"end"}>
                                        <Anchor icon={<Catalog size={'medium'}/>}
                                                label={t('epics.view.userstories')}
                                                hoverIndicator
                                                onClick={() => setShowUserstories(true)}>
                                        </Anchor>
                                    </Box>
                                </Box>

                                <FormField htmlfor="name" label={t('epics.view.name')} error={errorName} name={"name"}>
                                    <TextInput id="name" name="name"/>
                                </FormField>

                                <FormField htmlFor={"description"} name={"description"}
                                           label={t('epics.view.description')} error={errorDescription}>
                                    <TextArea name="description" id={"description"} size={"medium"}>
                                    </TextArea>
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

                            <Box direction={"column"} width={"medium"} margin={{top: "large", bottom: "large"}}>

                                <FormField label={t('epics.view.startdate')} name="startdate" margin={{top: "large"}}>
                                    <DayPickerView
                                        date={startdate}
                                        setDate={setStartdate}>
                                    </DayPickerView>
                                </FormField>


                                <FormField name={"finishdate"}
                                           label={t('epics.view.finishdate')} error={errorFinishdate}>
                                    <DayPickerView
                                        date={finishdate}
                                        setDate={setFinishdate}>
                                    </DayPickerView>
                                </FormField>


                                <Text alignSelf={"start"} margin={{top: "large", left: "small", bottom: "small"}}
                                      color="brand">{t('epics.view.workflow.status')}</Text>

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
                subject={"epic"}
                column={"name"}
                header={t('epics.view.name')}
                title={t('epics.view.search.title')}
                setShowSearch={setShowSearch}
                setErrorCode={setErrorCode}
                setShowErrorView={setShowErrorView}
                onSelectDoc={onSelectDoc}>
            </SearchView>
            }

            {showUserstories &&
            <AssignUserstoryViewContainer
                setErrorCode={setErrorCode}
                setShowErrorView={setShowErrorView}
                dependents={userstories}
                setDependents={setUserstories}
                setShowDependents={setShowUserstories}>
            </AssignUserstoryViewContainer>
            }


            {showErrorView &&
            <ErrorView handleClose={onClickHome} errorCode={errorCode}></ErrorView>
            }

        </Grommet>
    );
}
