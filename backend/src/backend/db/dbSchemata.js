/**
 * @module dbSchemata
 *
 * @description
 * defines the jsonSchemata for the database
 *
 * @author Hans-Peter Görg
 **/

const {PRIORITY, ROLE} = require('../../shared/constants/enums');

const userstorySchema = {
        bsonType: "object",
        required: ["version", "name", "description", "storypoints","priority", "verification"],
        properties: {
            version: {
                bsonType: "int"
            },
            name: {
                bsonType: "string"
            },
            description: {
                bsonType: "string"
            },
            storypoints: {
                bsonType: "int"
            },
            priority: {
                enum: [
                    PRIORITY.VERY_LOW,
                    PRIORITY.LOW,
                    PRIORITY.MEDIUM,
                    PRIORITY.HIGH,
                    PRIORITY.VERY_HIGH
                ]
            },
            verification: {
                bsonType: "string"
            }
        }
    };

const releaseSchema = {
    bsonType: "object",
    required: ["version", "name", "releasenr", "launchdate","userstories", "launched"],
    properties: {
        version: {
            bsonType: "int"
        },
        name: {
            bsonType: "string"
        },
        releasenr: {
            bsonType: "string"
        },
        launchdate: {
            bsonType: "date"
        },
        userstories: {
            bsonType: ["array"],
            uniqueItems: true,
            additionalProperties: false,
            items: {
                bsonType: "object",
                required: ["userstory_ref"],
                properties: {
                    userstory_ref: {
                        bsonType: "objectId"
                    }
                }
            }
        },
        launched: {
            bsonType: "bool"
        }
    }
};

const impedimentSchema = {
    bsonType: "object",
    required: ["version", "name", "description", "measures"],
    properties: {
        version: {
            bsonType: "int"
        },
        name: {
            bsonType: "string"
        },
        description: {
            bsonType: "string"
        },
        measures: {
            bsonType: ["array"],
            uniqueItems: true,
            additionalProperties: false,
            items: {
                bsonType: "object",
                required: ["measure", "done"],
                properties: {
                    measure: {
                        bsonType: "string"
                    },
                    done: {
                        bsonType: "bool"
                    }
                }
            }
        }
    }
};

const memberSchema = {
    bsonType: "object",
    required: ["version", "name", "firstname", "email", "role"],
    properties: {
        version: {
            bsonType: "int"
        },
        name: {
            bsonType: "string"
        },
        firstname: {
            bsonType: "string"
        },
        email: {
            bsonType: "string"
        },
        password: {
            bsonType: "string"
        },
        role: {
            enum: [
                ROLE.SCRUMMASTER,
                ROLE.PRODUCTOWNER,
                ROLE.SCRUMTEAMMEMBER,
                ROLE.STAKEHOLDER,
                ROLE.ADMIN
            ]
        }
    }
};

const sprintSchema = {
    bsonType: "object",
    required: ["version", "name","goal", "startdate", "finishdate", "verification","userstories","tasks","team","retrospective","review"],
    properties: {
        version: {
            bsonType: "int"
        },
        name: {
            bsonType: "string"
        },
        goal: {
            bsonType: "string"
        },
        startdate: {
            bsonType: "date"
        },
        finishdate: {
            bsonType: "date"
        },
        verification: {
            bsonType: "string"
        },
        team: {
            bsonType: ["array"],
            uniqueItems: true,
            additionalProperties: false,
            properties: {
                items: {
                    bsonType: "object",
                    required: ["member_ref"],
                    properties: {
                        member_ref: {
                            bsonType: "objectId"
                        },
                    }
                }
            }
        },
        userstories: {
            bsonType: ["array"],
            uniqueItems: true,
            additionalProperties: false,
            properties: {
                items: {
                    bsonType: "object",
                    required: ["userstory_ref"],
                    properties: {
                        userstory_ref: {
                            bsonType: "objectId"
                        }
                    }
                }
            }
        },
        tasks: {
            bsonType: ["array"],
            uniqueItems: true,
            additionalProperties: false,
            items: {
                bsonType: "object",
                required: ["task", "workflow", "color"],
                additionalProperties: false,
                properties: {
                    task: {
                        bsonType: "string"
                    },
                    workflow: {
                        bsonType: "string"
                    },
                    color: {
                        bsonType: "string"
                    }
                }
            }
        },
        retrospective: {
            bsonType: ["array"],
            uniqueItems: true,
            additionalProperties: false,
            items: {
                bsonType: "object",
                required: ["question", "statement"],
                properties: {
                    question: {
                        bsonType: "string"
                    },
                    statement: {
                        bsonType: "string"
                    }
                }
            }
        },
        review: {
            bsonType: ["array"],
            uniqueItems: true,
            additionalProperties: false,
            items: {
                bsonType: "object",
                required: ["question", "statement"],
                properties: {
                    question: {
                        bsonType: "string"
                    },
                    statement: {
                        bsonType: "string"
                    }
                }
            }
        }
    }
};

const epicSchema = {
    bsonType: "object",
    required: ["version", "name", "description", "startdate", "finishdate", "verification", "userstories"],
    properties: {
        version: {
            bsonType: "int"
        },
        name: {
            bsonType: "string"
        },
        description: {
            bsonType: "string"
        },
        startdate: {
            bsonType: "date"
        },
        finishdate: {
            bsonType: "date"
        },
        verification: {
            bsonType: "string"
        },
        userstories: {
            bsonType: ["array"],
            uniqueItems: true,
            additionalProperties: false,
            properties: {
                items: {
                    bsonType: "object",
                    required: ["userstory_ref"],
                    properties: {
                        userstory_ref: {
                            bsonType: "objectId"
                        }
                    }
                }
            }
        }
    }
};

exports.userstorySchema = userstorySchema;
exports.releaseSchema = releaseSchema;
exports.impedimentSchema = impedimentSchema;
exports.memberSchema = memberSchema;
exports.sprintSchema = sprintSchema;
exports.epicSchema = epicSchema;
