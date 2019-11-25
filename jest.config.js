"use strict";

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "src/**/*.js"],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 90,
      lines: 100,
      statements: 100,
    },
  },
  testEnvironment: "node",
  preset: "ts-jest",
};
