/**
 * @module SprintsViewPresenter
 *
 * @description
 * Presenter part of the view to edit sprints
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
    Text,
    Select,
    Anchor,
} from 'grommet';
import {Catalog, Group, Task, Workshop} from 'grommet-icons';
import {Search} from 'grommet-icons';
import {useTranslation} from "react-i18next";

import DayPickerView from "../shared/DayPickerView";
import ToolbarView from "../Toolbar/ToolbarView";
import ErrorView from "../shared/ErrorView";
import SearchView from "../shared/SearchView";
import AssignUserstoryViewContainer from "../shared/AssignUserstories/AssignUserstoryViewContainer";
import EditTableQuestionStatementViewContainer
    from "../shared/EditTableQuestion/EditTableQuestionStatementViewContainer";
import AssignMemberViewContainer from "../shared/AssignMember/AssignMemberViewContainer";
import DialogTaskBoardView from "./TaskBoard/DialogTaskBoardView";

import Tooltip from 'react-tooltip-lite';
import {THEME, TOOLTIP_COLOR} from "../../configTheme";


export default function SprintsViewPresenter(
    {
        status, doc, setDoc, areInputsValid, createDoc, updateDoc, setShowSearch, errorName,
        startdate, setStartdate, finishdate, setFinishdate, errorFinishdate, onClickNew, deletable, onClickDelete,
        onClickHome, errorCode, showErrorView, setErrorCode, setShowErrorView, onSelectDoc, showSearch,
        showUserstories, setShowUserstories, userstories, setUserstories, errorGoal,
        showReview, setShowReview, review, setReview,
        showRetrospective, setShowRetrospective, retrospective, setRetrospective,
        showTeam, setShowTeam, team, setTeam,
        tasks, setTasks, showTaskBoard, setShowTaskBoard,
        verificationWfOptions
    }) {

    const {t} = useTranslation();
    const DUMMY_NEW_ID = 'NEW';

    return (
        <Grommet theme={THEME}>

            <ToolbarView status={status} subject={t('sprints.view.title')}></ToolbarView>

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
                            event.value.team = team;
                            event.value.tasks = tasks;
                            event.value.review = review;
                            event.value.retrospective = retrospective;
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
                                    <Tooltip content={t('sprints.view.search.title')} direction={"right"}
                                             color={TOOLTIP_COLOR} arrow={false}>
                                        <Button primary
                                                onClick={() => setShowSearch(true)}
                                                icon={<Search size={'medium'}></Search>}
                                        >
                                        </Button>
                                    </Tooltip>
                                </Box>

                                <Box direction={"row"} margin={{bottom: "medium"}}>
                                    <Box direction={"column"} fill={true}>
                                    </Box>
                                    <Box direction={"column"} fill={true} align={"end"}>
                                        <Anchor icon={<Catalog size={'small'}/>}
                                                label={t('sprints.view.userstories')}
                                                hoverIndicator
                                                onClick={() => setShowUserstories(true)}>
                                        </Anchor>
                                    </Box>
                                    <Box direction={"column"} fill={true} align={"end"}>
                                        <Anchor icon={<Group size={'small'}/>}
                                                label={t('sprints.view.team')}
                                                hoverIndicator
                                                onClick={() => setShowTeam(true)}>
                                        </Anchor>
                                    </Box>
                                    <Box direction={"column"} fill={true} align={"end"}>
                                        <Anchor icon={<Task size={'small'}/>}
                                                label={t('sprints.view.taskboard')}
                                                hoverIndicator
                                                onClick={() => setShowTaskBoard(true)}>
                                        </Anchor>
                                    </Box>
                                </Box>

                                <FormField htmlfor="name" label={t('sprints.view.name')}  margin={{top: "medium"}} error={errorName}
                                           name={"name"}>
                                    <TextInput id="name" name="name"/>
                                </FormField>

                                <FormField htmlFor={"goal"} name={"goal"} margin={{top: 'medium'}}
                                           label={t('sprints.view.goal')} error={errorGoal}>
                                    <TextInput name="goal" id={"goal"}>
                                    </TextInput>
                                </FormField>

                                <Box direction={"row"} gap={"large"} margin={{top: "large"}}>
                                    <Box direction={"column"}>
                                        <Button type={"submit"} primary label={t('general.submit')} name="save"
                                                id={"save"}/>
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

                                <FormField label={t('sprints.view.startdate')} name="startdate" margin={{top: "large"}}>
                                    <DayPickerView
                                        date={startdate}
                                        setDate={setStartdate}>
                                    </DayPickerView>
                                </FormField>


                                <FormField name={"finishdate"}
                                           label={t('sprints.view.finishdate')} error={errorFinishdate}>
                                    <DayPickerView
                                        date={finishdate}
                                        setDate={setFinishdate}>
                                    </DayPickerView>
                                </FormField>


                                <Text alignSelf={"start"} margin={{top: "large", left: "small", bottom: "small"}}
                                      color="brand">{t('sprints.view.workflow.status')}</Text>

                                <Select name={"verification"} id={"verification"} dropAlign={{top: "top"}}
                                        options={verificationWfOptions}
                                        labelKey={"labelKey"}
                                        valueKey={"valueKey"}
                                >
                                </Select>

                                <Box direction={"row"} margin={{top: "large"}}>
                                    <Box direction={"column"} align={"start"}>
                                        <Anchor icon={<Workshop size={'medium'}/>}
                                                label={t('sprints.view.retrospective')}
                                                hoverIndicator
                                                onClick={() => setShowRetrospective(true)}>
                                        </Anchor>
                                    </Box>

                                    <Box direction={"column"} margin={{left: "large"}}>
                                        <Anchor icon={<Workshop size={'medium'} align={"end"}/>}
                                                label={t('sprints.view.review')}
                                                hoverIndicator
                                                onClick={() => setShowReview(true)}>
                                        </Anchor>
                                    </Box>
                                </Box>
                            </Box>

                        </Box>
                    </Form>
                </Box>

                <Box gridArea='right'/>

            </Grid>
            }

            {showSearch &&
            <SearchView
                subject={"sprint"}
                column={"name"}
                header={t('sprints.view.name')}
                title={t('sprints.view.search.title')}
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

            {showTeam &&
            <AssignMemberViewContainer
                setErrorCode={setErrorCode}
                setShowErrorView={setShowErrorView}
                dependents={team}
                setDependents={setTeam}
                setShowDependents={setShowTeam}>
            </AssignMemberViewContainer>
            }

            {showTaskBoard &&
            <DialogTaskBoardView
                tasks={tasks}
                setTasks={setTasks}
                setShowTaskBoard={setShowTaskBoard}>
            </DialogTaskBoardView>
            }

            {showRetrospective &&
            <EditTableQuestionStatementViewContainer
                data={retrospective}
                setData={setRetrospective}
                setShowMe={setShowRetrospective}
                title={t('edittable.title.retrospective')}
            >
            </EditTableQuestionStatementViewContainer>
            }

            {showReview &&
            <EditTableQuestionStatementViewContainer
                data={review}
                setData={setReview}
                setShowMe={setShowReview}
                title={t('edittable.title.review')}
            >
            </EditTableQuestionStatementViewContainer>
            }


            {showErrorView &&
            <ErrorView handleClose={onClickHome} errorCode={errorCode}></ErrorView>
            }

        </Grommet>
    );
}
