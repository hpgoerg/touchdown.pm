/**
 * @module WorkflowStepView
 *
 * @description
 * View component of [TaskBoardView](views_Sprint_TaskBoard_TaskBoardView.js.html)
 * that represents a task workflow lane
 *
 * @author Hans-Peter Görg
 **/
import React from 'react';
import TaskView from './TaskView';
import {Box, Heading} from "grommet";

const WorkflowStepView = ({
                              workflowStep, tasksForWorkflowStep,
                              onDragStart, onDragOver, onDrop, title, onDeleteTask,
                              taskBoardTasks, setTaskBoardTasks, setErrorHint, setChangedContent
                          }) => {
    return (
        <Box direction={"column"}
             background={"light-2"}
             margin={{right: "medium"}}
             align={"center"}
             height={{min: "70vh"}}
             width={"30vh"}
             flex={"grow"}
             onDragOver={e => onDragOver(e)}
             onDrop={e => onDrop(e, workflowStep)}

             overflow={"auto"}
        >
            <Heading level={4}>{title}</Heading>

            <Box>
                {tasksForWorkflowStep.map(task => (
                    <TaskView
                        key={task.task}
                        onDragStart={onDragStart}
                        onDeleteTask={onDeleteTask}
                        task={task}
                        taskBoardTasks={taskBoardTasks}
                        setTaskBoardTasks={setTaskBoardTasks}
                        setErrorHint={setErrorHint}
                        setChangedContent={setChangedContent}
                    />
                ))}
            </Box>
        </Box>
    )
};

export default WorkflowStepView;
