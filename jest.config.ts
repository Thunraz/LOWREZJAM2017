import type { Config } from 'jest';

const config: Config = {
    transform: { '^.+\\.ts?$': 'ts-jest' },
    testEnvironment: 'jsdom',
    testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: -10,
        }
    },
    collectCoverageFrom: [
        './src/lib/*.ts',
        './src/lib/**/*.ts',
        '!**/node_modules/**',
        '!**/vendor/**',
    ],
};

export default config;
