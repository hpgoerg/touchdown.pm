/**
 * @module TaskBoardView
 *
 * @description
 * View to component to edit tasks and there workflow status
 *
 * @author Hans-Peter Görg
 **/
import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import WorkflowStepView from './WorkflowStepView';
import {Grommet, Box, Button, Text, Heading} from "grommet";
import {grommet} from 'grommet/themes';
import {Add, Checkmark} from "grommet-icons";
import {cloneDeep, findIndex} from 'lodash';
import uuid from 'react-uuid';
import {taskWf} from "../../../configFixedTaskWorkflow";
import Tooltip from "react-tooltip-lite";
import {TOOLTIP_COLOR} from "../../../configTheme";
import {COLOR} from "../../../shared/constants/enums";

const TaskBoardView = ({tasks, setTasks, setShowTaskBoard, setChangedContent}) => {

    const {t} = useTranslation();

    const workflowStepsData = [
        {id: t(taskWf[0])},
        {id: t(taskWf[1])},
        {id: t(taskWf[2])},
        {id: t(taskWf[3])}
    ];


    const importTasks = (taskData) => {
        return taskData.map((aTask) => {
            aTask.isNew = false;
            //used within TaskBoard to identify tasks when changing task.task
            aTask.id = uuid();
            aTask.workflow = t(aTask.workflow);
            return aTask;
        })
    };

    const exportTasks = (e) => {
        e.preventDefault();

        let tasksToExport = [];
        for (let i = 0; i < taskBoardTasks.length; i++) {
            let aTask = taskBoardTasks[i];

            //find i18n id key for aTask.workflow
            //this i18n id is used for persistence
            let i18nPos = findIndex(workflowStepsData, (aStep) => {
                return (aTask.workflow === aStep.id)
            });


            aTask.workflow = taskWf[i18nPos];

            if (!aTask.isNew) {
                tasksToExport.push(
                    {
                        task: aTask.task,
                        workflow: aTask.workflow,
                        color: aTask.color
                    })
            }
        }

        setTasks(tasksToExport);
        setShowTaskBoard(false);
    }

    const [taskBoardTasks, setTaskBoardTasks] = useState(importTasks(tasks));
    const [workflowSteps] = useState(workflowStepsData);
    const [errorHint, setErrorHint] = useState("");


    const onDragStart = (e, task) => {
        setErrorHint("");
        e.dataTransfer.setData('transfer', task);
    };
    const onDragOver = e => {
        e.preventDefault();
    };
    const onDrop = (e, workflowStep) => {
        setErrorHint("");
        const task = e.dataTransfer.getData('transfer');

        const newTasks = taskBoardTasks.filter(aTask => {
            if (aTask.task === task) {
                aTask.workflow = workflowStep;
            }
            return aTask;
        });

        setTaskBoardTasks(newTasks);
        setChangedContent(true);
    };

    const onNewTask = (e) => {
        e.preventDefault();
        setErrorHint("");

        let posNewTask = findIndex(taskBoardTasks, (task) => {
            return task.isNew
        });

        if (posNewTask !== -1) {
            return;
        }

        let newTasks = cloneDeep(taskBoardTasks);
        newTasks.unshift({
            id: uuid(),
            task: t('taskboard.view.new.task.text'),
            workflow: workflowStepsData[0].id,
            color: COLOR.LIGHT_2,
            isNew: true
        });
        setTaskBoardTasks(newTasks);

        setChangedContent(true);
    };

    return (
        <Grommet theme={grommet}>

            <Box direction={"column"}></Box>
            <Box direction={"column"}>
                <Heading level={3} alignSelf={"center"} textAlign={"center"}
                         color={"brand"}>{t('taskboard.view.title')}</Heading>
            </Box>
            <Box direction={"column"}></Box>

            <Text size={"medium"} weight={"bold"} disabled={(errorHint !== "")} margin={{left: "small"}}>
                {errorHint}
            </Text>

            <Box direction={"row"} fill={true} basis={"full"} align={"stretch"} margin={{left: "small"}}>
                {workflowSteps.map(aWorkflowStep => (
                    <WorkflowStepView
                        key={aWorkflowStep.id}
                        workflowStep={aWorkflowStep.id}
                        title={aWorkflowStep.id}
                        onDragStart={onDragStart}
                        onDragOver={onDragOver}
                        onDrop={onDrop}
                        taskBoardTasks={taskBoardTasks}
                        setTaskBoardTasks={setTaskBoardTasks}
                        tasksForWorkflowStep={taskBoardTasks.filter(
                            task => task.workflow === aWorkflowStep.id,
                        )}
                        setErrorHint={setErrorHint}
                        errorHint={errorHint}
                        setChangedContent={setChangedContent}
                    />
                ))}
            </Box>


            <Box direction={"column"} align={"center"} as={"footer"}>
                <Box direction={"row"}>
                    <Button label={t('taskboard.view.new.task')} secondary icon={<Add size={"medium"}/>} size={"small"}
                            plain
                            margin={{top: "medium", bottom: "small", right: "xlarge"}}
                            onClick={onNewTask}
                    >
                    </Button>
                    <Tooltip content={t('general.accept.and.back')} direction={"right"} color={TOOLTIP_COLOR}
                             arrow={false}>
                        <Button secondary icon={<Checkmark size={"medium"}/>} size={"small"} primary
                                margin={{top: "medium", left: "small", bottom: "small"}}
                                onClick={exportTasks}
                        >
                        </Button>
                    </Tooltip>
                </Box>
            </Box>
        </Grommet>
    );
}

export default TaskBoardView;
