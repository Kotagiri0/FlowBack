# 🧪 Тестирование FlowBack

## Обзор тестов

Проект содержит полный набор тестов для проверки функциональности:

### 📂 Структура тестов

```
tests/
├── unit/                    # Юнит-тесты
│   ├── utils.test.js       # Тесты утилит
│   ├── state.test.js       # Тесты состояния
│   └── api.test.js         # Тесты API
├── integration/            # Интеграционные тесты
│   └── workflow.test.js    # Тесты бизнес-процессов
├── validation/             # Валидация данных
│   └── json.test.js        # Проверка JSON файлов
└── setup.js                # Настройка тестового окружения
```

## 🚀 Запуск тестов

### Все тесты
```bash
npm test
```

### Тесты с отслеживанием изменений
```bash
npm run test:watch
```

### Покрытие кода
```bash
npm run test:coverage
```

### Только валидация JSON
```bash
npm run validate:json
```

## 📊 Покрытие кода

Минимальные требования к покрытию:
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

Отчет о покрытии генерируется в папке `coverage/`.

## 🔍 Что тестируется

### Unit Tests (Юнит-тесты)

#### utils.test.js
- ✅ Форматирование дат
- ✅ Валидация email
- ✅ Расчет NPS
- ✅ Расчет CSAT
- ✅ Определение тональности
- ✅ Генерация ID
- ✅ Экспорт в CSV

#### state.test.js
- ✅ Получение опросов
- ✅ Получение опроса по ID
- ✅ Добавление опроса
- ✅ Получение клиентов
- ✅ Добавление клиента
- ✅ Получение метрик
- ✅ Получение аналитики

#### api.test.js
- ✅ API запросы опросов
- ✅ API запросы клиентов
- ✅ API запросы метрик
- ✅ API запросы фидбека
- ✅ API запросы аналитики

### Integration Tests (Интеграционные тесты)

#### workflow.test.js
- ✅ Создание и получение опроса
- ✅ Создание и получение клиента
- ✅ Расчет метрик из фидбека
- ✅ Загрузка данных дашборда

### Validation Tests (Валидация)

#### json.test.js
- ✅ Валидность JSON файлов
- ✅ Корректность структуры данных
- ✅ Валидация email адресов
- ✅ Проверка обязательных полей

## 🔧 Настройка тестового окружения

### Jest конфигурация
Настроена в `jest.config.js`:
- Тестовое окружение: jsdom
- Покрытие кода включено
- Пороги покрытия: 70%

### ESLint
Настроен в `.eslintrc.json`:
- Поддержка Jest
- Глобальные переменные приложения
- Правила кодирования

### Babel
Настроен в `.babelrc`:
- Поддержка современного JavaScript
- Транспиляция для Node.js

## 🔄 CI/CD

### GitHub Actions

#### Основной workflow (ci-cd.yml)
Запускается при:
- Push в `main` или `develop`
- Pull Request в `main` или `develop`

Этапы:
1. **Lint** - проверка кода ESLint
2. **Validate JSON** - проверка JSON файлов
3. **Test** - запуск всех тестов (Node 16, 18, 20)
4. **Build** - сборка приложения
5. **Deploy** - деплой на GitHub Pages (только main)

#### PR Checks (pr-checks.yml)
Запускается при Pull Request:
- Проверка размера PR
- Проверка описания PR
- Быстрые тесты
- Проверка конфликтов
- Авто-ревью для Dependabot

## 📈 Метрики качества

### Badges для README
Добавьте эти бейджи в README.md:

```markdown
![CI/CD](https://github.com/yourusername/flowback/workflows/FlowBack%20CI%2FCD/badge.svg)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-70%25-yellow)
```

## 🐛 Отладка тестов

### Запуск отдельного теста
```bash
npm test -- utils.test.js
```

### Отладка в VSCode
Добавьте конфигурацию в `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal"
}
```

## 📝 Написание новых тестов

### Шаблон теста
```javascript
describe('MyModule', () => {
  describe('myFunction', () => {
    test('should do something', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = MyModule.myFunction(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Best Practices
- ✅ Один тест = одна проверка
- ✅ Используйте `describe` для группировки
- ✅ Пишите понятные названия тестов
- ✅ Очищайте состояние в `beforeEach`
- ✅ Покрывайте edge cases
- ✅ Используйте моки для внешних зависимостей

## 🔐 Pre-commit хуки

Установите husky для автоматической проверки:

```bash
npm install --save-dev husky
npx husky install
npx husky add .husky/pre-commit "npm test"
```

## 📞 Поддержка

Если тесты падают:
1. Проверьте логи в консоли
2. Посмотрите отчет о покрытии в `coverage/`
3. Запустите тесты с флагом `--verbose`
4. Проверьте GitHub Actions для деталей

---

**Версия документа**: 1.0.0  
**Дата обновления**: Декабрь 2024