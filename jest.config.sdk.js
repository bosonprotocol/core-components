module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.{ts,js,jsx,tsx}"],
  coverageReporters: ["json", "text"],
  coveragePathIgnorePatterns: ["jest.config.js", "/node_modules/", "/dist/"],
  moduleNameMapper: {
    "^@bosonprotocol/(.*)$": "<rootDir>/../$1/"
  },
  globals: {
    "ts-jest": {
      tsconfig: "../../tsconfig.tests.json"
    }
  }
};
