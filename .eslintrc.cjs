/* eslint-env node */
module.exports = {
    root: true,
    env: {
        "browser": true,
    },
    extends: [
        'airbnb-base',
    ],
    parserOptions: {
        'ecmaVersion': 'latest',
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-const-assign': 'warn',
        'no-this-before-super': 'warn',
        'no-undef': 'warn',
        'no-unreachable': 'warn',
        'no-unused-vars': [
            "warn", // or "error"
            {
                "argsIgnorePattern": "^_",
                "varsIgnorePattern": "^_",
                "caughtErrorsIgnorePattern": "^_"
            }
        ],
        'no-var': 'error',
        'no-tabs': 'error',
        'no-multi-spaces': 'off',
        'no-trailing-spaces': ['error', { 'skipBlankLines': true }],
        'no-bitwise': 'off',
        'no-plusplus': 'off',
        'no-duplicate-imports': 'error',
        'no-continue': 'off',

        'constructor-super': 'warn',
        'valid-typeof': 'warn',
        'indent': ['error', 4],
        'sort-imports': 'error',
        'import/order': 'off',
        'valid-jsdoc': 'warn',
        'quotes': ['error', 'single'],
        'quote-props': 'off',
        'lines-between-class-members': ['error', 'always', { 'exceptAfterSingleLine': true }],

        'linebreak-style': 'off',

        'spaced-comment': [
            'error',
            'always',
            {
                'block': { 'exceptions': ['/'] },
                'line': { 'exceptions': ['*/', '*'] },
            },
        ],
        'import/prefer-default-export': 'off',
        'import/no-extraneous-dependencies': [
            'error',
            {
                'devDependencies': true,
                'optionalDependencies': false,
                'peerDependencies': false,
            },
        ],

        "max-len": [
            "error",
            120,
            2,
            {
                "ignoreUrls": true,
                "ignoreComments": false,
                "ignoreRegExpLiterals": true,
                "ignoreStrings": true,
                "ignoreTemplateLiterals": true
            }
        ],
    },
};
