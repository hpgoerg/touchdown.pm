/**
 * @module configFixedTaskWorkflow
 *
 * @description
 * This workflow defines the workflow steps for task.
 * The values represent i18n ids. These ids get persisted.
 *
 * Beware!  _This is a fixed workflow - dont change it_
 *
 * @author Hans-Peter Görg
 **/
taskWf = ["taskwf.todo", "taskwf.inprogress", "taskwf.inreview", "taskwf.done"];

exports.taskWf=taskWf;