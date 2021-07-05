/**
 * @module dbCreateHelper
 *
 * @description
 * helpers to create dependent_refs. Exception handling must be done be caller.
 *
 * @author Hans-Peter Görg
 **/
const {getHashedPassword} = require('../../shared/authentification/authentication');
const {logerror} = require('../../shared/util/logWrapper');
const {CODE} = require('../../shared/constants/code');
const {isSet} = require('../../shared/util/generalUtils');
const {NO_VALUE} = require('../../shared/constants/enums');
const {checkPassword} = require('../../shared/util/passwordCheck');


let createCmds = {
    member: createMember,
    userstory: createUserstory,
    impediment: createImpediment,
    release: createRelease,
    sprint: createSprint,
    epic: createEpic
};

const INITIAL_DOCUMENT_VERSION = 1;

async function createMember(db, {name, firstname, email, password, role}) {
    let aMember = {
        version: INITIAL_DOCUMENT_VERSION,
        name: name,
        firstname: firstname,
        email: email,
        password: getHashedPassword(password),
        role: role
    };

    return await db.collection('member').insertOne(aMember);
}

async function createUserstory(db, {name, description, storypoints, priority, verification}) {
    let aStory = {
        version: INITIAL_DOCUMENT_VERSION, name: name, description: description,
        storypoints: storypoints, priority: priority, verification: verification
    };

    return await db.collection('userstory').insertOne(aStory);
}

async function createImpediment(db, {name, description, measures}) {
    anImpediment = {
        version: INITIAL_DOCUMENT_VERSION, name: name, description: description, measures: measures
    };

    return await db.collection('impediment').insertOne(anImpediment);
}

async function createRelease(db, {name, releasenr, launchdate, userstories, launched}) {
    let aRelease = {
        version: INITIAL_DOCUMENT_VERSION, name: name, releasenr: releasenr, launchdate: launchdate,
        userstories: userstories, launched: launched
    };

    return await db.collection('release').insertOne(aRelease);
}

async function createSprint(db, {
    name, goal, startdate, finishdate,
    userstories, team, tasks, retrospective, review, verification
}) {
    let aSprint = {
        version: INITIAL_DOCUMENT_VERSION, name: name, goal: goal,
        startdate: startdate, finishdate: finishdate, userstories: userstories, team: team,
        retrospective: retrospective, review: review, verification: verification,
        tasks: tasks
    };

    return await db.collection('sprint').insertOne(aSprint)
}

async function createEpic(db, {
    name, description, startdate, finishdate,
    verification, userstories
}) {
    let anEpic = {
        version: INITIAL_DOCUMENT_VERSION,
        name: name,
        description: description,
        startdate: startdate,
        finishdate: finishdate,
        verification: verification,
        userstories: userstories
    };

    return await db.collection('epic').insertOne(anEpic);
}

/**
 * generic create function.
 *
 * the caller is responsible to ensure that the document data conforms to the schema of the collection
 *
 * @param db {object}- the database
 * @param document {object}- the document to persist
 * @param coll {string}- the collection, where to persist the document
 * @returns {Promise<{code: string}|{code: string, insertedId: ObjectId}>} - returns a value of [CODE](module-code.html)
 * and on successful persisting the document the insertedId of this document
 */
async function create(db, document, coll) {
    try {
        if (coll === 'member') {
            if (!checkPassword(document.password)) {
                return {
                    code: CODE.INVALID_PASSWORD,
                    insertedId: NO_VALUE,
                    insertedDoc: NO_VALUE
                }
            }
        }

        const result = await createCmds[coll](db, document);

        const newDoc = await db.collection(coll).findOne({_id: result.insertedId});
        return {
            code: CODE.OK,
            insertedId: result.insertedId,
            insertedDoc: newDoc
        };
    } catch (error) {
        let code;
        if ((isSet(error.code) && (error.code === 11000))) {
            code = CODE.DUPLICATE_KEY;
        } else {
            logerror(`[dbCreatehelper#create]: ${error.toString()}`);
            code = CODE.DB_ERROR_OCCURRED;
        }

        return {
            code: code,
            insertedId: NO_VALUE,
            insertedDoc: NO_VALUE
        };
    }
}


exports.create = create;
exports.createMember = createMember;
exports.createUserstory = createUserstory;
exports.createImpediment = createImpediment;
exports.createRelease = createRelease;
exports.createSprint = createSprint;
exports.createEpic = createEpic;
