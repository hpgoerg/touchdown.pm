/**
 * @module VerificationWfUtils
 *
 * @description
 * View utils to handle the verification workflow status.
 *
 * @author Hans-Peter Görg
 **/
import {getVerificationWf} from "../../shared/backendConfig/backendConfig";

/**
 * Build the internationalized select option for the first taskWf step
 *
 * @param t {function} - i18n translate function
 * @returns {{labelKey: string, valueKey: string}} - the internationalized select option for the first taskWf step
 */
const getVerificationWfOptionCreated = (t) => {
    return ({ labelKey: t(getVerificationWf()[0]), valueKey: getVerificationWf()[0] });
};

/**
 * Build the internationalized select option for a taskWf step
 *
 * @param t {function} - i18n translate function
 * @param aStep {string} - a taskWf step (representing a i18n id)
 * @returns {{labelKey: string, valueKey: string}} - the internationalized select option for the given taskWf step
 */
const getVerificationWfOptionForStep = (t, aStep) => {
    return ({ labelKey: t(aStep), valueKey: aStep });
};

/**
 * Build the internationalized select options to choose a taskWf step
 *
 * @param t {function} - i18n translate function
 * @returns {{labelKey: string, valueKey: string}}[] - the interationalized select options array
 */
const getVerificationWfOptionsForSelect = (t) => {
    const verificationWf = getVerificationWf();
    let options = [];

    verificationWf.forEach( (aVerificationWf) => {
        let option = { labelKey: t(aVerificationWf), valueKey: aVerificationWf};
        options.push(option);
    });

    return options;
};


export {getVerificationWfOptionCreated, getVerificationWfOptionForStep, getVerificationWfOptionsForSelect}