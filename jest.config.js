module.exports = {

    transform: {

        ".(t|j)sx?": "ts-jest",

    },

    moduleFileExtensions: [

        "ts",

        "tsx",

        "js",

        "jsx",

    ],

    testRegex: ".*\\.test\\.(t|j)sx?$",

    clearMocks: true,

    restoreMocks: true,

    testEnvironment: 'node',

    globals: {
        "ts-jest": {
            "compiler": "ttypescript"
        }
    },

    setupFiles: [
        "<rootDir>test/config.ts"
    ]

};