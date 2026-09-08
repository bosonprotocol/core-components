// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require("../../jest.config.sdk");

// Only tests/ holds tests here; src/ is components and stories.
baseConfig.testMatch = ["<rootDir>/tests/**/*.test.ts"];

// The shared `collectCoverageFrom` instruments every file under src/. In the
// SDK packages that is a few dozen modules; here it is 600+ components and
// stories no test loads, and ts-jest spends minutes on them to report zeroes.
// Coverage still runs - over the files the tests actually pull in.
delete baseConfig.collectCoverageFrom;

module.exports = baseConfig;
