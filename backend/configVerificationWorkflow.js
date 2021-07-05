/**
 * @module configVerificationWorkflow
 *
 * @description
 * This workflow defines the workflow steps for
 * * epic
 * * sprint
 * * userstory
 *
 * The values represent i18n ids.
 * In the database these ids are persisted in field _verification_.
 *
 * __ verificationWfProduction can be adapted to organizational needs (see README.md)
 *
 * @author Hans-Peter Görg
 **/
const verificationWfProduction =
    [ "verificationwf.created", "verificationwf.inverification", "verificationwf.approved", "verificationwf.rejected", "verificationwf.implemented"  ];


/**
 * verification workflow for test
 *
 * Beware: do not change - can break tests
 * @type {string[]}
 */
const verificationWfTest =
    [ "verificationwf.created", "verificationwf.inverification", "verificationwf.approved", "verificationwf.rejected", "verificationwf.implemented" ];


if (!global.jasmine) { //production
    exports.verificationWf = verificationWfProduction
} else { //test only
    exports.verificationWf = verificationWfTest
}

exports.verificationWfProduction = verificationWfProduction;
exports.verificationWfTest = verificationWfTest;
