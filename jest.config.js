module.exports = {
  // Тестовое окружение
  testEnvironment: 'jsdom',

  // Паттерны для поиска тестов
  testMatch: [
    '**/tests/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],

  // Файлы для игнорирования
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/'
  ],

  // Покрытие кода
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'js/**/*.js',
    '!js/main.js',
    '!**/node_modules/**'
  ],

  // Пороги покрытия
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },

  // Репортеры покрытия
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json'
  ],

  // Setup файлы
  setupFiles: [
    '<rootDir>/tests/setup.js'
  ],

  // Трансформация файлов
  transform: {
    '^.+\\.js$': 'babel-jest'
  },

  // Verbose вывод
  verbose: true,

  // Таймаут для тестов
  testTimeout: 10000,

  // Очистка моков между тестами
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
};