/**
 * @module dbSetupTestData
 *
 * @description
 * this modules offers functions to create default data for tests.
 *
 * Beware! Please don't change; otherwise tests may break
 *
 * @author Hans-Peter Görg
 **/

const moment = require('moment');
const {PRIORITY, ROLE, COLOR, STORYPOINTS} = require('../../shared/constants/enums');
const {verificationWf} = require('../../../configVerificationWorkflow');
const {taskWf} = require('../../../configFixedTaskWorkflow');

const {PASSWORD_VALID_FOR_TEST} = require('../../../config');

function defaultTestMember() {
    return {
        name: 'Miller', firstname: 'John', email: 'john.miller@scrummers.com', password: PASSWORD_VALID_FOR_TEST, role: ROLE.SCRUMMASTER
    };
}

function defaultTestUserstory() {
    return {
        name: 'error dashboard',
        description: 'As an admin I want to have an dashboard allowing me to see all critical errors at one',
        storypoints: STORYPOINTS.ONE,
        priority: PRIORITY.HIGH,
        verification: verificationWf[verificationWf.length-1]
    };
}

function defaultTestImpediment() {
    return {
        name: 'network to slow', description: 'the network is to slow to work effectively',
        measures: [{measure: 'install more repeaters', done: true}]
    };
}

function defaultTestSprint(userstory_ref) {

    let startdate = moment().toDate();
    let finishdate = moment().add(14, 'days').toDate();

    return {
        name: 'event management sprint', goal: 'create a great user experience for virtual events',
        startdate: startdate, finishdate: finishdate, userstories: [{userstory_ref: userstory_ref}],
        team: [],
        tasks: [
            {task: 'Develop the frontend', workflow: taskWf[0], color: COLOR.ACCENT_1},
            {task: 'Develop the backend', workflow: taskWf[taskWf.length -1], color: COLOR.ACCENT_2}
        ],
        retrospective:
            [{question: 'What worked well?', statement: 'the team did communicate very well'}],
        review:
            [{question: 'What do the stakeholders say?', statement: 'We are very impressed by the results'}],
        verification: verificationWf[0]
    };
}

function defaultTestRelease(userstory_ref) {
    return {
        name: 'admin release',
        releasenr: '0.0.9',
        launchdate: new Date(),
        userstories: [{userstory_ref: userstory_ref}],
        launched: false
    };
}

function defaultTestEpic(userstory_ref) {
    let startdateEpic = moment().toDate();
    let finishdateEpic = moment().add(140, 'days').toDate();

    return {
        name: 'online point of sales',
        description: 'develop an attractive online point of sales',
        startdate: startdateEpic, finishdate: finishdateEpic,
        verification: verificationWf[verificationWf.length-1],
        userstories: [{userstory_ref: userstory_ref}],
    };
}

exports.defaultTestMember = defaultTestMember;
exports.defaultTestUserstory = defaultTestUserstory;
exports.defaultTestImpediment = defaultTestImpediment;
exports.defaultTestSprint = defaultTestSprint;
exports.defaultTestEpic = defaultTestEpic;
exports.defaultTestRelease = defaultTestRelease;
