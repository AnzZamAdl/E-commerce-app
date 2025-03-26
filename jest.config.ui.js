export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/__ui_tests__/**/*.test.ts'],
  setupFilesAfterEnv: ['./src/__ui_tests__/setup.ts'],
};