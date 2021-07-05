/**
 * @module configTheme
 *
 * @description
 * contains general theme config data
 *
 * @author Hans-Peter Görg
 **/

import {deepMerge} from "grommet/utils";
import {Grommet} from "grommet";

const TOOLTIP_COLOR = "DarkOrchid";

const THEME = deepMerge(Grommet, {
    formField: {
        error: {
            size: 'xsmall',
        },
        label: {
            alignSelf: "start",
            color: "brand"
        }
    },
    dataTable: {
        primary: {
            weight: 400
        }
    },
    global: {
        //colors: { brand: '#93b8ee'}, //brand is the leading color
        font: {
            family: 'Roboto',
            size: '16px',
            height: '12px'
        },
        input: {
            font: {
                weight: 400
            }
        },
        control: {
            disabled: {
                opacity: 0.5
            }
        }
    },
    textArea: {
        extend: () => `
      font-size: 16px;
      font-height: 12px;
    `,
    },
});

export {THEME, TOOLTIP_COLOR};