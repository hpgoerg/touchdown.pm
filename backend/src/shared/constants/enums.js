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
 * These ids get persisted
 *
 * @type {{NOTDEFINED: string, HIGH: string, MEDIUM: string, LOW: string}}
 */
exports.PRIORITY = {
    VERY_LOW: 1,
    LOW: 2,
    MEDIUM: 3,
    HIGH: 4,
    VERY_HIGH: 5
}

/**
 * Role
 *
 * The values represent i18n ids.
 * These ids get persisted
 *
 * @type {{SCRUMMASTER: string, SCRUMTEAMMEMBER: string, STAKEHOLDER: string, ADMIN: string, PRODUCTOWNER: string}}
 */
exports.ROLE = {
    SCRUMMASTER: 'role.scrummaster',
    PRODUCTOWNER: 'role.productowner',
    SCRUMTEAMMEMBER: 'role.teammember',
    STAKEHOLDER: 'role.stakeholder',
    ADMIN: 'role.admin'
};

/**
 * Color
 *
 * These colors are used as task colors to signal task optically that belong together
 *
 * @type {{STATUS_WARNUNG: string, STATUS_OK: string, LIGHT_2: string, ACCENT_4: string, ACCENT_3: string, ACCENT_2: string, ACCENT_1: string}}
 */
exports.COLOR = {
    LIGHT_2: "light2",
    ACCENT_1: "accent-1",
    ACCENT_2: "accent-2",
    ACCENT_3: "accent-3",
    ACCENT_4: "accent-4",
    BRAND: "brand",
    NEUTRAL_3: "neutral-3"
};

/**
 * Possible storypoint values
 *
 * As recommended by scrum authors fibonacci values are used
 *
 * @type {{EIGHT: number, FIVE: number, ONE: number, THIRTEEN: number, TWENTYONE: number, TWO: number, THREE: number}}
 */
exports.STORYPOINTS = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FIVE: 5,
    EIGHT: 8,
    THIRTEEN: 13,
    TWENTYONE: 21
};

exports.NO_VALUE = Symbol('NO_VALUE');


