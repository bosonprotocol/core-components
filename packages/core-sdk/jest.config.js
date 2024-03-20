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

module.exports = baseConfig;
