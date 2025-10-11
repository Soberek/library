const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
// export default {
//   testEnvironment: "node",
//   preset: "ts-jest",
//   transform: {
//     ...tsJestTransformCfg,
//   },
// };

module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

  transform: {
    ...tsJestTransformCfg,
    ...createDefaultPreset().transform,
  },
  
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  
};
