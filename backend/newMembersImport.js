
/**
 * @module newMembersImport
 *
 * @description
 * members load file for usage with: runDBImportMembers.js
 *
 * Please adopt newMembers array to your organizational needs.
 * Beware: emails must be unique
 *
 * @author Hans-Peter Görg
 **/
const {ROLE} = require('./src/shared/constants/enums');
const {PASSWORD_VALID_FOR_TEST} = require('./config');

exports.newMembers = [
    {
        "name": "Demo",
        "firstname": "Dan",
        "email": "dan.demo@scrummers.com",
        "password": PASSWORD_VALID_FOR_TEST,
        "role": ROLE.ADMIN
    },
    {
        "name": "Evan",
        "firstname": "Evangelista",
        "email": "evan.evangelista@scrummers.com",
        "password": PASSWORD_VALID_FOR_TEST,
        "role": ROLE.SCRUMMASTER
    },
    {
        "name": "Henrikssohn",
        "firstname": "Hannah",
        "email": "hannah2.henrikssohn@scrummers.com",
        "password": PASSWORD_VALID_FOR_TEST,
        "role": ROLE.SCRUMTEAMMEMBER
    },
    {
        "name": "LaRue",
        "firstname": "Elise",
        "email": "elise.larue@scrummers.com",
        "password": PASSWORD_VALID_FOR_TEST,
        "role": ROLE.STAKEHOLDER
    },
    {
        "name": "Jan",
        "firstname": "Klaave",
        "email": "jan.klaave@scrummers.com",
        "password": PASSWORD_VALID_FOR_TEST,
        "role": ROLE.PRODUCTOWNER
    }
];
