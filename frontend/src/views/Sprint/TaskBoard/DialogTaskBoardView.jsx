/**
 * @module DialogTaskBoardView
 *
 * @description
 * View dialog wrapper for [TaskBoardView](views_Sprint_TaskBoard_TaskBoardView.js.html)
 *
 * @author Hans-Peter Görg
 **/
import React, {useState} from 'react';

import TaskBoardView from './TaskBoardView';
import {Layer, Box} from "grommet";


const DialogTaskBoardView = ({tasks, setTasks, setShowTaskBoard}) => {

    const [changedContent, setChangedContent] = useState(false);

    const onClose = (e) => {
        e.preventDefault();

        if (!changedContent) {
            setShowTaskBoard(false);
        }
    };

    return (
        <>
            <Layer
                onEsc={onClose}
                onClickOutside={onClose}
            >
                <Box flex overflow={"auto"}
                     border={{size: "medium", color: "brand"}}
                     round={false}
                     background={"light-1"}
                >
                    <TaskBoardView
                        tasks={tasks}
                        setTasks={setTasks}
                        setShowTaskBoard={setShowTaskBoard}
                        setChangedContent={setChangedContent}
                    />
                </Box>
            </Layer>
        </>
    );
}

export default DialogTaskBoardView;