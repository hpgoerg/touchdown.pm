/**
 * @module ReleasesViewPresenter
 *
 * @description
 * Presenter part of the view to edit releases
 *
 * @author Hans-Peter Görg
 **/
import React from 'react';

import {
    Grommet,
    Form,
    FormField,
    TextInput,
    Box,
    Button,
    Grid,
    Anchor,
    CheckBox
} from 'grommet';
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


export default function ReleasesViewPresenter(
    {
        status, doc, setDoc, areInputsValid, createDoc, updateDoc, setShowSearch, errorName, errorReleasenr,
        launchdate, setLaunchdate, onClickNew, deletable, onClickDelete,
        onClickHome, errorCode, showErrorView, setErrorCode, setShowErrorView, onSelectDoc, showSearch,
        showUserstories, setShowUserstories, userstories, setUserstories
    }) {

    const {t} = useTranslation();
    const DUMMY_NEW_ID = 'NEW';

    return (
        <Grommet theme={THEME}>

            <ToolbarView status={status} subject={t('releases.view.title')}></ToolbarView>

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
                            event.value.launchdate = launchdate;
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
                                    <Tooltip content={t('releases.view.search.title')} direction={"right"} color={TOOLTIP_COLOR} arrow={false}>
                                        <Button primary
                                                onClick={() => setShowSearch(true)}
                                                icon={<Search size={'medium'}></Search>}
                                        >
                                        </Button>
                                    </Tooltip>
                                </Box>

                                <Box direction={"row"}>
                                    <Box direction={"column"} fill={true}>
                                    </Box>
                                    <Box direction={"column"} fill={true} align={"end"} margin={{bottom: "small"}}>
                                        <Anchor icon={<Catalog size={'medium'}/>}
                                                label={t('releases.view.userstories')}
                                                hoverIndicator
                                                onClick={() => setShowUserstories(true)}>
                                        </Anchor>
                                    </Box>
                                </Box>

                                <FormField htmlfor="name" label={t('releases.view.name')}
                                           error={errorName} name={"name"}>
                                    <TextInput id="name" name="name"/>
                                </FormField>

                                <FormField htmlfor="releasenr" label={t('releases.view.releasenr')}
                                           error={errorReleasenr} name={"releasenr"}>
                                    <TextInput id="releasenr" name="releasenr"/>
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

                                <FormField label={t('releases.view.launchdate')} name="launchdate"
                                           margin={{top: "large"}}>
                                    <DayPickerView
                                        date={launchdate}
                                        setDate={setLaunchdate}>
                                    </DayPickerView>
                                </FormField>

                                <FormField name="launched" margin={{top: "medium"}}>
                                    <CheckBox
                                        checked={doc.launched}
                                        label={t('releases.view.launched')}
                                        name={"launched"}
                                    />
                                </FormField>
                            </Box>

                        </Box>

                    </Form>
                </Box>

                <Box gridArea='right'/>

            </Grid>
            }

            {showSearch &&
            <SearchView
                subject={"release"}
                column={"releasenr"}
                header={t('releases.view.releasenr')}
                title={t('releases.view.search.title')}
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
