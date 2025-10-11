require('@testing-library/jest-dom');

// Mock import.meta.env for tests
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_API_KEY: 'test-api-key',
        VITE_AUTH_DOMAIN: 'test-project.firebaseapp.com',
        VITE_PROJECT_ID: 'test-project',
        VITE_STORAGE_BUCKET: 'test-project.appspot.com',
        VITE_MESSAGING_SENDER_ID: '123456789',
        VITE_APP_ID: 'test-app-id',
        VITE_MEASUREMENT_ID: 'G-TEST123',
      },
    },
  },
});

// Mock Firebase config
jest.mock('./config/firebaseConfig', () => ({
  auth: {},
  db: {},
}));
