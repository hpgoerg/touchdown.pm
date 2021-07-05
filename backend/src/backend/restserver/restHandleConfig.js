/**
 * @module restHandleConfig
 * @author Hans-Peter Görg
 **/

const {CODE} = require('../../shared/constants/code');
const {
    PASSWORD_REGEX,
    PASSWORD_REGEX_FOR_TEST,
    PASSWORD_VALID_FOR_TEST
} = require('../../../config');
const {verificationWfProduction, verificationWfTest} = require('../../../configVerificationWorkflow');

async function handleConfigProduction(ctx) {
    try {
        ctx.status = 200;
        ctx.body = {
            code: CODE.OK,
            passwordRegexForProduction: PASSWORD_REGEX,
            verificationWfProduction: verificationWfProduction
        };
    } catch (error) {
        handleError(ctx, error, '[restHandleConfig#handleConfigProduction]');
    }
}

async function handleConfigTest(ctx) {
    try {
        ctx.status = 200;
        ctx.body = {
            code: CODE.OK,
            passwordRegexForTest: PASSWORD_REGEX_FOR_TEST,
            passwordForTest: PASSWORD_VALID_FOR_TEST,
            verificationWfTest: verificationWfTest
        };
    } catch (error) {
        handleError(ctx, error, '[restHandleConfig#handleConfigTest]');
    }
}

exports.handleConfigProduction = handleConfigProduction;
exports.handleConfigTest = handleConfigTest;
