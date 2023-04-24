// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require("../jest.config.sdk");

module.exports = {
  ...baseConfig,
  rootDir: "..",
  collectCoverageFrom: [
    "<rootDir>/packages/**/*.{ts,js,jsx,tsx}",
    "!<rootDir>/packages/react-kit/**",
    "!<rootDir>/packages/subgraph/**"
  ],
  moduleNameMapper: {
    "^@bosonprotocol/(.*)$": "<rootDir>/packages/$1/"
  },
  globals: {
    "ts-jest": {
      tsconfig: "./tsconfig.tests.json"
    }
  }
};
