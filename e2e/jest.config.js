module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: false,
  // moduleNameMapper: {
  //   "^@bosonprotocol/(.*)$": "<rootDir>/../$1/"
  // },
  globals: {
    "ts-jest": {
      tsconfig: "./tsconfig.tests.json"
    }
  }
};
