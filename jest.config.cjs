module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js', 'jest-fetch-mock/setupJest'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          target: 'ES2022',
          module: 'commonjs',
          jsx: 'react-jsx',
          esModuleInterop: true,
          verbatimModuleSyntax: false,
          isolatedModules: true,
          skipLibCheck: true,
        },
        diagnostics: {
          ignoreCodes: [1343],
        },

      },
    ],
  },
};



