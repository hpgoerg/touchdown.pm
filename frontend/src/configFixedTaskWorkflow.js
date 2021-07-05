/**
 * @module configFixedTaskWorkflow
 *
 * @description
 * This workflow defines the workflow steps for task.
 * The values represent i18n ids. These ids get persisted.
 * SeeFor [i18n definitions](module-i18n.html) to find location of the locale files.
 *
 * Beware!  _This is a fixed workflow - dont change it_
 *
 * @author Hans-Peter Görg
 **/
const taskWf = ["taskwf.todo", "taskwf.inprogress", "taskwf.inreview", "taskwf.done"];

export {taskWf}