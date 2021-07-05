/**
 * @module account
 *
 * @description
 * represents the account of a logged in member
 *
 * @author Hans-Peter Görg
 **/
import {isSet} from "../shared/util/generalUtils";
import {NO_VALUE, ROLE} from "../shared/constants/enums";

let accountMember = NO_VALUE;

/**
 * Set the member account of a logged in member.
 *
 * @param aMember {object} - member data
 */
const setMember = (aMember) => {
    accountMember = aMember;
};


/**
 * Get the account of a member
 *
 * @returns {object | NO_VALUE} - account of a member, NO_VALUE: member account not set
 */
const getAccount = () => {
    return accountMember;
};


/**
 * Answers, if an account is active
 *
 * @returns {boolean} - true=active account, false=no active account
 */
const hasActiveAccount = () => {
    return (isSet(accountMember));
}

/**
 * Answers, if an account is active and represents the Account of an admin
 *
 * @returns {boolean} - _true_ account is active and account of an admin, _false_ account is not active or not an account of an admin
 */
const isAdmin = () => {
    return (hasActiveAccount() && getAccount().role === ROLE.ADMIN);
}


/**
 * logout account
 */
const logoutFromAccount = () => {
    accountMember = NO_VALUE;
};

export {
    setMember,
    getAccount,
    logoutFromAccount,
    hasActiveAccount,
    isAdmin
};
