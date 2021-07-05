/**
 * @module enums
 *
 * @description
 * definition of enums
 *
 * @author Hans-Peter Görg
 **/

/**
 * Priority
 *
 * The values represent i18n ids.
 * These ids get persisted.
 *
 * @type {{HIGH: string, MEDIUM: string, LOW: string}}
 */
const PRIORITY = {
    VERY_LOW: 1,
    LOW: 2,
    MEDIUM: 3,
    HIGH: 4,
    VERY_HIGH: 5
};

/**
 * Role
 *
 * The values represent i18n ids.
 * These ids get persisted
 *
 * @type {{SCRUMMASTER: string, SCRUMTEAMMEMBER: string, STAKEHOLDER: string, ADMIN: string, PRODUCTOWNER: string, ADMIN: string}}
 */
const ROLE = {
    SCRUMMASTER: 'role.scrummaster',
    PRODUCTOWNER: 'role.productowner',
    SCRUMTEAMMEMBER: 'role.teammember',
    STAKEHOLDER: 'role.stakeholder',
    ADMIN: 'role.admin'
};

/**
 * Defines the workflow type
 *
 * @type {{TASK_WF: string, VERIFICATION_WF: string}}
 */
const WORKFLOW_TYPE = {
    VERIFICATION_WF: 'VERIFICATION_WF',
    TASK_WF: 'TASK_WF'
};

/**
 * Dummy value for no value
 *
 * @type {symbol}
 */
const NO_VALUE = Symbol('NO_VALUE');

/**
 * Defines ids for the help context
 *
 * @type {{EPIC: string, GENERAL: string}}
 */
const HELP_CONTEXT_ID = {
    GENERAL: "GENERAL",
    LOGIN: 'LOGIN',
    EPIC: 'EPIC',
    USERSTORY: 'USERSTORY',
    SPRINT: 'SPRINT',
    RELEASE: 'RELEASE',
    IMPEDIMENT: 'IMPEDIMENT',
    MEMBER: 'MEMBER'
};

/**
 * Color
 *
 * These colors are used as task colors to signal task optically that belong together
 *
 * @type {{STATUS_WARNUNG: string, STATUS_OK: string, LIGHT_2: string, ACCENT_4: string, ACCENT_3: string, ACCENT_2: string, ACCENT_1: string}}
 */
const COLOR = {
    LIGHT_2: "light2",
    ACCENT_1: "accent-1",
    ACCENT_2: "accent-2",
    ACCENT_3: "accent-3",
    ACCENT_4: "accent-4",
    BRAND: "brand",
    NEUTRAL_3: "neutral-3"
};

export {PRIORITY, ROLE, NO_VALUE, WORKFLOW_TYPE, HELP_CONTEXT_ID, COLOR};


