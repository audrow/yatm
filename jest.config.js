// eslint-disable-next-line no-undef
module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/scripts'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js|jsx)',
    '**/?(*.)+(spec|test).+(ts|tsx|js|jsx)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
}
