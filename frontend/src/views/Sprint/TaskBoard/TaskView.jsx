/**
 * @module TaskView
 *
 * @description
 * View component of [TaskBoardView](views_Sprint_TaskBoard_TaskBoardView.js.html)
 * that represents a task
 *
 * @author Hans-Peter Görg
 **/
import React, {useState, createRef} from 'react';
import {useTranslation} from "react-i18next";
import {
    Box,
    Card,
    CardHeader,
    CardFooter,
    Button,
    TextArea,
    Text, Keyboard
} from "grommet";
import {Edit, Trash, Checkmark, MoreVertical, Paint, Cut} from 'grommet-icons';
import {cloneDeep, remove, trim} from 'lodash';
import {extendedTrim, hasContent} from "../../../shared/util/generalUtils";
import {COLOR} from "../../../shared/constants/enums";
import {findIndex} from 'lodash';

const TaskView = ({onDragStart, task, taskBoardTasks, setTaskBoardTasks, setErrorHint, setChangedContent}) => {
    const {t} = useTranslation();

    const colors = Object.values(COLOR);
    const [editMode, setEditMode] = useState(false);
    const [disabledPaint, setDisabledPaint] = useState(false);
    const [disabledDelete, setDisabledDelete] = useState(false);

    const [lastColorPos, setLastColorPos] = useState(findIndex(colors, (aColor) => {return(aColor === task.color);}));



    let taskInput = createRef();


    const setNewColor = (e) => {
        e.preventDefault();
        let posOfColorToUse;

        if(lastColorPos === (colors.length - 1)) {
            posOfColorToUse = 0;
            setLastColorPos(posOfColorToUse);
        } else {
            posOfColorToUse = lastColorPos + 1;
            setLastColorPos(posOfColorToUse);
        }

        //posOfColorToUse is necessary, because changed value of lastColorPos
        //is not visible within the event method
        task.color = colors[posOfColorToUse];

        setChangedContent(true);
    };

    const onDeleteTask = (e, task) => {
        e.preventDefault();
        setErrorHint("");
        setEditMode(false);
        let newTasks = cloneDeep(taskBoardTasks);
        remove(newTasks, (aTask) => aTask.task === task.task);
        setTaskBoardTasks(newTasks);
    };

    const onInitEdit = (e) => {
        e.preventDefault();

        setErrorHint("");
        setEditMode(true);

        setDisabledDelete(true);
        setDisabledPaint(true);
    };

    const onCutEdit = (e) => {
        e.preventDefault();
        setErrorHint("");
        taskInput.current.value = '';
        taskInput.current.focus();
    };

    const onQuitEditWithEsc = (e) => {
        setErrorHint("");
        setEditMode(false);
        setDisabledPaint(false);
        setDisabledDelete(false);

        e.target.value = task.task
    }

    const onEndEdit = (e) => {
        setErrorHint("");
        setEditMode(false);
        setDisabledPaint(false);
        setDisabledDelete(false);

        let editTask = taskInput.current.value;
        editTask = trim(editTask);

        editTask = extendedTrim(editTask, false);
        if (! hasContent(editTask)) {
            setErrorHint(t('taskboard.view.enter.text'));
            e.target.value = task.task;
            return;
        }

        if (editTask === task.task) {
            return;
        }

        let alreadyExists = false;
        for (let i = 0; i < taskBoardTasks.length; i++) {
            let aTask = taskBoardTasks[i];
            if (aTask.task === editTask) {
                alreadyExists = true;
                break;
            }
        }

        if (alreadyExists) {
            setErrorHint(t('taskboard.view.duplicate'));
            e.target.value = task.task;
            return;
        }

        let newTasks = [];

        for (let i = 0; i < taskBoardTasks.length; i++) {
            let aTask = taskBoardTasks[i];
            let taskTask = aTask.task;
            if (aTask.id === task.id) {
                taskTask = editTask;
            }
            newTasks.push({
                id: aTask.id,
                task: taskTask,
                workflow: aTask.workflow,
                color: aTask.color,
                isNew: false
            });
        }

        setTaskBoardTasks(newTasks);
        setChangedContent(true);
    };

    return (

        <Box
            draggable
            onDragStart={e => onDragStart(e, task.task)}
            width={"35vh"}
        >
            <Card margin={{top: "medium", left: "small", right: "small"}} background={{color: task.color, opacity: true}}
                  border={{size: "small"}} size={"small"}>
                <CardHeader gap={"xsmall"} alignSelf={"center"} pad={"xsmall"}>
                    <Box direction={"row"} align={"center"}>
                        {editMode &&
                        <Keyboard onEnter={onEndEdit} onEsc={onQuitEditWithEsc}>
                        <TextArea
                            name={"task"}
                            id={"task"}
                            size={"small"}
                            defaultValue={task.task}
                            autoFocus
                            ref={taskInput}
                        >
                        </TextArea>
                        </Keyboard>
                        }
                        {!editMode &&
                        <Text size={"small"}>
                            {task.task}
                        </Text>
                        }
                    </Box>
                </CardHeader>
                <CardFooter pad={{horizontal: "small"}} background={"light-1"}>
                    <Box direction={"row"} align={"center"}>
                        {!editMode &&
                        <Button icon={<Edit size={"small"}/>} hoverIndicator
                                onClick={onInitEdit}
                        />
                        }
                        {editMode &&
                        <>

                            <Button icon={<Checkmark size={"small"}/>} hoverIndicator
                                    onClick={onEndEdit}
                            />
                            <Button icon={<Cut size={"small"}/>} hoverIndicator
                                    onClick={onCutEdit}
                            />
                        </>
                        }
                        <MoreVertical size={"small"}></MoreVertical>
                        <Button icon={<Paint size={"small"}/>}
                                hoverIndicator
                                onClick={(e) => setNewColor(e)}
                                disabled={disabledPaint}
                        >
                        </Button>
                        <Button icon={<Trash size={"small"}/>}
                                hoverIndicator
                                onClick={(e) => onDeleteTask(e, task)}
                                disabled={disabledDelete}
                        >
                        </Button>
                    </Box>
                </CardFooter>
            </Card>
        </Box>
    );
};

export default TaskView;
