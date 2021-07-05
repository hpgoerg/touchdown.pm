/**
 * @module dbGenerateMassData
 *
 * @description
 * Creates mass sample data and persists them into database.
 *
 * @author Hans-Peter Görg
 **/
const {padStart} = require('lodash');
const faker = require('faker');

const {verificationWf} = require('../../../configVerificationWorkflow');
const {taskWf} = require('../../../configFixedTaskWorkflow');
const {getHashedPassword} = require('../../shared/authentification/authentication');
const {PASSWORD_VALID_FOR_TEST} = require('../../../config');
const {ROLE, PRIORITY, COLOR, STORYPOINTS} = require('../../shared/constants/enums');


const INITIAL_DOCUMENT_VERSION = 1;
const roles = [ROLE.SCRUMMASTER, ROLE.PRODUCTOWNER, ROLE.SCRUMTEAMMEMBER, ROLE.STAKEHOLDER, ROLE.ADMIN];
const priorities = Object.values(PRIORITY);

const storyPoints = Object.values(STORYPOINTS);
const padsCount = 3;

let userstoryNr = 0;
let defaultMember = false;


const anImpedimentNetwork = {
    name: 'network to slow',
    description: 'the network is to slow to work effectively',
    measures: [{measure: 'buy repeaters', done: false}]
};
const anImpedimentPO = {
    name: 'PO not available',
    description: 'PO is often not available to clarify business questions in sprint',
    measures: [{measure: 'name a deputy', done: true}]
};
const anImpedimentRooms = {
    name: 'rooms not suitable for scrum',
    description: 'we only have rooms for 2 persons',
    measures: [{measure: 'move to thinktank building', done: false}]
};

const aTaskFrontend = {
    task: "develop the frontend",
    workflow: taskWf[0],
    color: COLOR.ACCENT_1
};

const aTaskBackend = {
    task: "develop the backend",
    workflow: taskWf[taskWf.length -1],
    color: COLOR.ACCENT_2
};

const aTaskQS = {
    task: "do a quality check",
    workflow: taskWf[0],
    color: COLOR.ACCENT_3
};

let memberRefs;
let memberRefsCount;

const impediments = [anImpedimentNetwork, anImpedimentPO, anImpedimentRooms];
const tasks = [aTaskFrontend, aTaskBackend, aTaskQS];

const generateMembers = async (db, count) => {
    let docs = [];

    for (let i = 0; i < count; i++) {
        let firstName;
        let name;
        let email;

        if (!defaultMember) {
            name = 'Demo';
            firstName = 'Dan';
            email = "dan.demo@scrummers.com";
            defaultMember = true;
        } else {
            firstName = faker.name.firstName();
            name = faker.name.lastName();

            let nr = padStart(parseInt(i), padsCount, '0');

            email = `${firstName}.${name}${nr}@scrummers.com`;
        }

        let role = roles[Math.round(Math.random() * 4)];
        if( (name === 'Demo') && (firstName === 'Dan')) {
            role = ROLE.ADMIN;
        }

        let doc = {
            version: INITIAL_DOCUMENT_VERSION,
            name: name,
            firstname: firstName,
            email: email,
            password: getHashedPassword(PASSWORD_VALID_FOR_TEST),
            role: role
        };
        docs.push(doc);
    }

    let result = await db.collection('member').insertMany(docs, {ordered: true});
    memberRefs = result.insertedIds;
    memberRefsCount = result.insertedCount;
};

const generateEpics = async (db, count, countUserstories) => {
    let docs = [];
    for (let i = 0; i < count; i++) {
        const company = faker.company.companyName();
        const keyWord = faker.company.bsNoun();

        const nr = padStart(parseInt(i), padsCount, '0');

        const name = `Epic-${nr}: ${keyWord} for ${company}`;
        const description = `Develop ${keyWord} for ${company}`;

        let doc = {
            version: INITIAL_DOCUMENT_VERSION,
            name: name,
            description: description,
            startdate: faker.date.recent(),
            finishdate: faker.date.future(),
            verification: verificationWf[Math.round(Math.random()*(verificationWf.length-1))],
            userstories: await helperAssignUserstories(db, countUserstories)
        };
        docs.push(doc);
    }
    await db.collection('epic').insertMany(docs, {ordered: true});
};

const generateSprints = async (db, count, countUserstories) => {
    let docs = [];
    for (let i = 0; i < count; i++) {
        const company = faker.company.companyName();
        const keyWord = faker.company.bsNoun();

        const nr = padStart(parseInt(i), padsCount, '0');

        const name = `Develop Sprint-${nr}: ${keyWord} for ${company}`;
        const goal = `Really impress the customer ${company} with the developed ${keyWord}`;

        let doc = {
            version: INITIAL_DOCUMENT_VERSION,
            name: name,
            goal: goal,
            startdate: faker.date.recent(),
            finishdate: faker.date.future(),
            verification: verificationWf[Math.round(Math.random()*(verificationWf.length-1))],
            userstories: await helperAssignUserstories(db, countUserstories),
            team: await helperAssignMembers(),
            tasks: tasks,
            retrospective: [{question: 'What could be improved?', statement: 'PO availability should be improved'}],
            review: [{
                question: 'Has the sprint goal been reached',
                statement: 'We are very satisfied with the results'
            }]
        };
        docs.push(doc);
    }
    await db.collection('sprint').insertMany(docs, {ordered: true});
};

const generateReleases = async (db, count, countUserstories) => {
    let docs = [];
    for (let i = 0; i < count; i++) {

        const digits1to3 = faker.system.semver();
        const digit4 = padStart(parseInt(i), padsCount, '0');
        const releasenr = `${digits1to3}.${digit4}`;

        const name = `Release (${releasenr}) for ${faker.company.companyName()} - app: ${faker.commerce.department()}`;

        let launchdate;
        let launched = false;
        if (i % 2 === 0) {
            launchdate = faker.date.future();
        } else {
            launchdate = faker.date.past();
            launched = true;
        }

        let doc = {
            version: INITIAL_DOCUMENT_VERSION,
            name: name,
            releasenr: releasenr,
            launchdate: launchdate,
            userstories: await helperAssignUserstories(db, countUserstories),
            launched: launched
        };
        docs.push(doc);
    }
    return await db.collection('release').insertMany(docs, {ordered: true});
};

const generateUserstories = async (db, count) => {
    let docs = [];
    for (let i = 0; i < count; i++) {
        const storyRole = faker.name.jobTitle();
        const keyWord = faker.company.catchPhrase();
        let nr = padStart(parseInt(userstoryNr++), padsCount, '0');
        const name = `Story-${nr}: ${keyWord}`;
        let description = `As ${storyRole} "${keyWord}" is what I need`;

        let doc = {
            version: INITIAL_DOCUMENT_VERSION,
            name: name,
            description: description,
            storypoints: storyPoints[Math.round(Math.random() * (storyPoints.length - 1))],
            verification: verificationWf[Math.round(Math.random()*(verificationWf.length-1))],
            priority: priorities[Math.round(Math.random() * (priorities.length  -1))]
        };
        docs.push(doc);
    }
    return await db.collection('userstory').insertMany(docs, {ordered: true});
};

const generateImpediments = async (db, count) => {
    let docs = [];
    for (let i = 0; i < count; i++) {

        let impediment = impediments[Math.round(Math.random() * 2)];
        const nr = padStart(parseInt(i), padsCount, '0');

        let doc = {
            version: INITIAL_DOCUMENT_VERSION,
            name: `Impediment-${nr}: ${impediment.name}`,
            description: `${impediment.description}`,
            measures: impediment.measures
        };

        docs.push(doc);
    }
    await db.collection('impediment').insertMany(docs, {ordered: true});
};

const helperAssignUserstories = async (db, countUserstories) => {
    const {insertedIds} = await generateUserstories(db, countUserstories);
    let userstories = [];

    for (let i = 0; i < countUserstories; i++) {
        const userstoryRef = {userstory_ref: insertedIds[i]};
        userstories.push(userstoryRef);
    }

    return userstories;
};

const helperAssignMembers = () => {

    let assignedMemberRefs = [];

    if(memberRefsCount > 0) {
        let countMembers = Math.round(Math.random() * (memberRefsCount/8));

        for (let i = 0; i <= countMembers; i++) {
            assignedMemberRefs.push({member_ref: memberRefs[i]})
        }
    }

    return assignedMemberRefs;
};

exports.generateEpics = generateEpics;
exports.generateMembers = generateMembers;
exports.generateUserstories = generateUserstories;
exports.generateReleases = generateReleases;
exports.generateImpediments = generateImpediments;
exports.generateSprints = generateSprints
