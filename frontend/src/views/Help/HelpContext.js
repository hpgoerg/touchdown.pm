/**
 * @module HelpContext
 *
 * @description
 * used to manage the actual help context
 *
 * @author Hans-Peter Görg
 **/
import {HELP_CONTEXT_ID} from "../../shared/constants/enums";


let helpContextId = HELP_CONTEXT_ID.GENERAL;

const setHelpContextId = (aHelpContextId) => {
    helpContextId = aHelpContextId;
}

const getHelpContextId = () => {
    return helpContextId;
}


export {setHelpContextId, getHelpContextId};