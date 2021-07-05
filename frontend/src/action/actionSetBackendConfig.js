/**
 * @module setBackendConfig
 *
 * @description
 * Actions to set those configuration data that are loaded from backend (rest server)
 *
 * @author Hans-Peter Görg
 **/

import {
    setVerificationWfProduction,
    setPasswordRegexForProduction
} from "../shared/backendConfig/backendConfig";
import {CODE} from "../shared/constants/code";
import {restGetConfigProduction} from "../service/serviceGetRest";

/**
 * On success sets those production configuration data that are loaded from backend (rest server)
 *
 * @returns {Promise<string>} - returns a value of [CODE](module-code.html).
 */
const setBackendConfigProduction = async () => {
    let result = await restGetConfigProduction();
    const {code} = result;
    if (code === CODE.OK) {
        const {verificationWfProduction, passwordRegexForProduction } = result;
        setVerificationWfProduction(verificationWfProduction);
        setPasswordRegexForProduction(passwordRegexForProduction);
    }

    return code;
};

export {setBackendConfigProduction};