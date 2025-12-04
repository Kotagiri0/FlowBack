// Test Setup File
// Загружаем все необходимые модули для тестов

// Mock для Chart.js
global.Chart = class Chart {
  constructor() {}
  destroy() {}
};

// Mock для DOM элементов
global.document.getElementById = jest.fn((id) => {
  return {
    classList: {
      add: jest.fn(),
      remove: jest.fn(),
      toggle: jest.fn()
    },
    style: {},
    value: '',
    innerHTML: '',
    addEventListener: jest.fn()
  };
});

global.document.querySelectorAll = jest.fn(() => []);
global.document.querySelector = jest.fn(() => null);

// Загружаем модули приложения
require('../js/config.js');
require('../js/utils.js');
require('../js/state.js');
require('../js/api.js');

// Mock для alert
global.alert = jest.fn();