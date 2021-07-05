/**
 * @module backendConfig
 *
 * @description
 * Holds configuration data, fetched from rest server.
 *
 * @author Hans-Peter Görg
 **/
import {NO_VALUE} from "../constants/enums";

let verificationWfProduction = NO_VALUE;
let passwordRegexForProduction = NO_VALUE;

const setVerificationWfProduction = (value) => {
    verificationWfProduction = value;
};
const setPasswordRegexForProduction = (value) => {
    passwordRegexForProduction = value;
};

const getVerificationWfProduction = () => {
    return verificationWfProduction;
};
const getPasswordRegexForProduction = () => {
    return passwordRegexForProduction;
};




const getVerificationWf = getVerificationWfProduction;
const getPasswordRegex = getPasswordRegexForProduction;

export {
    setVerificationWfProduction, setPasswordRegexForProduction,
    getVerificationWf, 
    getPasswordRegex,
    getVerificationWfProduction, getPasswordRegexForProduction
};