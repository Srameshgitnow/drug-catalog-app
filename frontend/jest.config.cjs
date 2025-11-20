module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  transform: { '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest' },
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js'
  },
  testMatch: ['**/?(*.)+(test).[jt]s?(x)']
};
