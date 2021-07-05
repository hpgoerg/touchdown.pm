/**
 * @module dbInsertSampleData
 *
 * @description
 * Creates sample data and persists them into database.
 * Beware! Don't change the sample data, because they are used for tests.
 *
 * @author Hans-Peter Görg
 **/
const moment = require('moment');
const {PRIORITY, ROLE, STORYPOINTS} = require('../../shared/constants/enums');
const {PASSWORD_VALID_FOR_TEST} = require('../../../config');
const
    {
        createMember,
        createUserstory,
        createImpediment,
        createRelease,
        createSprint,
        createEpic,
    } = require('./dbCreateHelper');

const {verificationWf} = require('../../../configVerificationWorkflow');

let aMemberMiller = {
    name: 'Miller',
    firstname: 'John',
    email: 'john.miller@scrummers.com',
    password: PASSWORD_VALID_FOR_TEST,
    role: ROLE.SCRUMMASTER
};
let aMemberLindow = {
    name: 'Lindow',
    firstname: 'Mia',
    email: 'mia.lindow@scrummers.com',
    password: PASSWORD_VALID_FOR_TEST,
    role: ROLE.SCRUMTEAMMEMBER
};
let aMemberMcCloud = {
    name: 'McCloud',
    firstname: 'Brian',
    email: 'brian.mccloud@scrummers.com',
    password: PASSWORD_VALID_FOR_TEST,
    role: ROLE.ADMIN
};
let aMemberKim = {
    name: 'Kim',
    firstname: 'Lee',
    email: 'lee.kim@scrummers.com',
    password: PASSWORD_VALID_FOR_TEST,
    role: ROLE.ADMIN
};
let aMemberMuller = {
    name: 'Ellen',
    firstname: 'Muller',
    email: 'ellen.muller@scrummers.com',
    password: PASSWORD_VALID_FOR_TEST,
    role: ROLE.SCRUMTEAMMEMBER
};
let aMemberLavale = {
    name: 'Lavale',
    firstname: 'Pierre',
    email: 'piere.lavale@scrummers.com',
    password: PASSWORD_VALID_FOR_TEST,
    role: ROLE.SCRUMTEAMMEMBER
};
let aMemberBriggs = {
    name: 'Briggs',
    firstname: 'Henry',
    email: 'henry.briggs@scrummers.com',
    password: PASSWORD_VALID_FOR_TEST,
    role: ROLE.PRODUCTOWNER
};

let aMemberMcCash = {
    name: 'McCash',
    firstname: 'Abraham',
    email: 'abraham.mccash@scrummers.com',
    password: PASSWORD_VALID_FOR_TEST,
    role: ROLE.SCRUMTEAMMEMBER
};

let aStoryBusinessDashboard = {
    name: 'business dashboard',
    description: 'as a business staff member I want to see all customer related data in an business dashboard with filtering possibilies',
    storypoints: STORYPOINTS.FIVE,
    priority: PRIORITY.VERY_HIGH,
    verification: verificationWf[verificationWf.length-1]
};
let aStoryFinancialDashboard = {
    name: 'financial dashboard',
    description: 'as CFO I need an overview showing the liabilities and their maturity',
    storypoints: STORYPOINTS.EIGHT,
    priority: PRIORITY.HIGH,
    verification: verificationWf[verificationWf.length-1]
};
let aStoryMarketingDashboard = {
    name: 'marketing dashboard',
    description: 'as marketing staff member I want to have a dashboard showing active and upcoming marketing events',
    storypoints: STORYPOINTS.THIRTEEN,
    priority: PRIORITY.MEDIUM,
    verification: verificationWf[verificationWf.length-1]
};
let aStoryAdminDashboard = {
    name: 'admin dashboard',
    description: 'As an admin I want to have an dashboard allowing me to see all critical errors at one',
    storypoints: STORYPOINTS.TWENTYONE,
    priority: PRIORITY.LOW,
    verification: verificationWf[verificationWf.length-1]
};


let anImpedimentNetwork = {
    name: 'network to slow',
    description: 'the network is to slow to work effectively',
    measures: [{measure: 'install more repeaters', done: false}]
};
let anImpedimentPO = {
    name: 'PO not available',
    description: 'PO is often not available to clarify business questions in sprint',
    measures: [{measure: 'designate a deputy', done: true}, {measure: 'schedule a question morning for main PO', done: false}]
};
let anImpedimentRooms = {
    name: 'rooms not suitable for scrum',
    description: 'we only have rooms for 2 persons',
    measures: [{measure: 'move to think tank building', done: true}]
};

let aReleaseAdmin = {
    name: 'admin release',
    releasenr: '0.1.0',
    launchdate: new Date(),
    launched: false
};
let aReleaseBusiness = {
    name: 'business release',
    releasenr: '0.2.0',
    launchdate: moment().add(14, 'days').toDate(),
    launched: false
};
let aReleaseMarketing = {
    name: 'marketing release',
    releasenr: '0.3.0',
    launchdate: moment().add(28, 'days').toDate(),
    launched: true
};
let aReleaseFinancial = {
    name: 'financial release',
    releasenr: '0.4.0',
    launchdate: moment().add(42, 'days').toDate(),
    launched: true
};

let aSprintBusiness = {
    name: 'business sprint', goal: 'create a great business dashboard',
    startdate: new Date(), finishdate: moment().add(13, 'days').toDate(),
    userstories: [], team: [], tasks: [],
    retrospective: [{question: 'What could be improved?',statement: 'PO availability should be improved'}],
    review: [{question: 'Has the sprint goal been reached',statement: 'We are very satisfied with the results'}],
    verification: verificationWf[0]
};

let aSprintFinancial = {
    name: 'financial sprint',
    goal: 'improve the existing financial controlling instruments',
    startdate: moment().add(13, 'days').toDate(),
    finishdate: moment().add(27, 'days').toDate(),
    userstories: [], team: [], tasks: [],
    retrospective:  [{question: 'What will help us in the next sprint?',statement: 'using the new version of our UI framework'}],
    review: [{question: 'Impressions of the stakeholders',statement: 'We need adjustment to new business needs '}],
    verification: verificationWf[verificationWf.length-1]
};

let aSprintMarketing = {
    name: 'marketing sprint',
    goal: 'give markting the dashboard they requested for years',
    startdate: moment().add(28, 'days').toDate(),
    finishdate: moment().add(41, 'days').toDate(),
    userstories: [], team: [], tasks: [],
    retrospective: [{question: 'What worked well?',statement: 'Team communication was good'}],
    review: [{question: 'Opinion of marketing',statement: 'Result are very promising'}],
    verification: verificationWf[verificationWf.length-1]
};

let aSprintAdmin = {
    name: 'admin sprint', goal: 'build the tools we need for devops',
    startdate: moment().add(42, 'days').toDate(), finishdate: moment().add(54, 'days').toDate(),
    userstories: [], team: [], tasks: [],
    retrospective: [{question: 'What will help us in the next sprint?',statement: 'Moving to the think tank building'}],
    review: [{question: 'What did administration say?',statement: 'Tool support has to be enhanced'}],
    verification: verificationWf[verificationWf.length-1]
};

let anEpicBusinessDashboards = {
    name: 'business dashboards',
    description: 'support business, finance and marketing with dashboards',
    startdate: new Date(), finishdate: moment().add(54, 'days').toDate(),
    verification: verificationWf[verificationWf.length-1]
};

let anEpicAdminDashboards = {
    name: 'admin dashboards',
    description: 'support the technical administration with admin dashboards',
    startdate: new Date(), finishdate: moment().add(54, 'days').toDate(),
    verification: verificationWf[verificationWf.length-1]
};

/**
 * Persists sample data into db.
 * Beware! Please don't change theme, because they are used in tests.
 *
 * @param db {Object}- the database
 * @returns {Promise<void>}
 */
async function insertSampleData(db) {
    await createMember(db, aMemberMiller);

    await createMember(db, aMemberLindow);
    await createMember(db, aMemberMcCloud);
    await createMember(db, aMemberKim);
    await createMember(db, aMemberMuller);
    await createMember(db, aMemberLavale);
    await createMember(db, aMemberBriggs);
    await createMember(db, aMemberMcCash);

    await createImpediment(db, anImpedimentNetwork);
    await createImpediment(db, anImpedimentPO);
    await createImpediment(db, anImpedimentRooms);


    let storyBusinessDashboard = await createUserstory(db, aStoryBusinessDashboard);
    let storyFinancialDashboard = await createUserstory(db, aStoryFinancialDashboard);
    let storyMarketingDashboard = await createUserstory(db, aStoryMarketingDashboard);
    let storyAdminDashboard = await createUserstory(db, aStoryAdminDashboard);

    aReleaseAdmin = extendRelease(aReleaseAdmin, [storyAdminDashboard]);
    await createRelease(db, aReleaseAdmin);

    aReleaseBusiness = extendRelease(aReleaseBusiness, [storyBusinessDashboard]);
    await createRelease(db, aReleaseBusiness);

    aReleaseMarketing = extendRelease(aReleaseMarketing, [storyMarketingDashboard]);
    await createRelease(db, aReleaseMarketing);

    aReleaseFinancial = extendRelease(aReleaseFinancial, [storyFinancialDashboard]);
    await createRelease(db, aReleaseFinancial);


    aSprintBusiness = extendSprint(aSprintBusiness, [storyBusinessDashboard]);
    await createSprint(db, aSprintBusiness);

    aSprintFinancial = extendSprint(aSprintFinancial, [storyFinancialDashboard]);
    await createSprint(db, aSprintFinancial);

    aSprintMarketing = extendSprint(aSprintMarketing, [storyMarketingDashboard]);
    await createSprint(db, aSprintMarketing);

    aSprintAdmin = extendSprint(aSprintAdmin, [storyAdminDashboard]);
    await createSprint(db, aSprintAdmin);



    anEpicAdminDashboards = extendEpic(anEpicAdminDashboards, [storyAdminDashboard]);
    await createEpic(db, anEpicAdminDashboards);

    anEpicBusinessDashboards = extendEpic(anEpicBusinessDashboards, [storyBusinessDashboard, storyMarketingDashboard, storyFinancialDashboard]);
    await createEpic(db, anEpicBusinessDashboards);
}

function extendRelease(aRelease, userstories) {
    let userstoryRefs = [];

    for (let i = 0; i < userstories.length; i++) {
        userstoryRefs.push({userstory_ref: userstories[i].insertedId});
    }

    aRelease.userstories = userstoryRefs;
    return aRelease;
}

function extendSprint(aSprint, userstories) {
    let userstoryRefs = [];

    for (let i = 0; i < userstories.length; i++) {
        userstoryRefs.push({userstory_ref: userstories[i].insertedId});
    }
    aSprint.userstories = userstoryRefs;

    return aSprint;
}

function extendEpic(anEpic, userstories) {
    let userstoryRefs = [];

    for (let i = 0; i < userstories.length; i++) {
        userstoryRefs.push({userstory_ref: userstories[i].insertedId});
    }
    anEpic.userstories = userstoryRefs;

    return anEpic;
}

exports.insertSampleData = insertSampleData;
