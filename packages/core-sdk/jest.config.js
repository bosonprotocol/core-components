// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require("../../jest.config.sdk");

baseConfig.transform = {
  "^.+\\.tsx?$": [
    "ts-jest",
    {
      tsconfig: "tsconfig.tests.json"
    }
  ]
};

baseConfig.setupFilesAfterEnv = ["./setupTests.ts"];

module.exports = baseConfig;
