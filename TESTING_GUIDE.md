# 🚀 Руководство по запуску QA тестов для TodoApp

## 📋 Содержание
1. [Установка](#установка)
2. [Структура тестов](#структура-тестов)
3. [Запуск тестов](#запуск-тестов)
4. [Лучшие практики](#лучшие-практики)
5. [Отладка](#отладка)
6. [CI/CD интеграция](#cicd-интеграция)

---

## 📦 Установка

### Предварительные требования
- Node.js 16+
- npm или yarn
- Playwright (уже в проекте)

### Шаги установки

```bash
# Установить зависимости
npm install

# Установить браузеры Playwright
npx playwright install

# Или установить только необходимые браузеры
npx playwright install chromium firefox webkit
```

---

## 📁 Структура тестов

```
tests/
├── todoapp-critical-flows.spec.ts       # КРИТИЧНЫЕ тесты (CRUD, фильтры)
├── todoapp-high-priority.spec.ts        # ВЫСОКИЙ ПРИОРИТЕТ (Sync, Share, Import/Export)
├── todoapp-medium-priority.spec.ts      # СРЕДНИЙ ПРИОРИТЕТ (Offline, Theme, PWA)
├── fixtures/
│   ├── test-data.json                   # Тестовые данные
│   └── example-import.json              # Пример для импорта
└── utils/
    ├── test-helpers.ts                  # Вспомогательные функции
    └── selectors.ts                     # Селекторы элементов
```

---

## ▶️ Запуск тестов

### Базовые команды

```bash
# Запустить все тесты
npm test

# Запустить конкретный файл
npm test tests/todoapp-critical-flows.spec.ts

# Запустить конкретный тест по названию
npm test -g "TC-001"

# Запустить с определённым браузером
npm test -- --project=chromium
npm test -- --project=firefox
npm test -- --project=webkit
```

### Режимы запуска

```bash
# Headed mode (видно браузер)
npx playwright test --headed

# Debug режим (интерактивная отладка)
npx playwright test --debug

# Show trace (показать трассировку)
npx playwright test --trace on

# Single worker (один рабочий процесс)
npx playwright test --workers=1

# Параллельное выполнение (по умолчанию)
npx playwright test --workers=4
```

### Фильтрация тестов

```bash
# Только критичные тесты
npm test tests/todoapp-critical-flows.spec.ts

# Тесты по приоритету
npm test -- -g "TC-00|TC-01|TC-02"  # Критичные
npm test -- -g "TC-1[0-4]"          # Высокий приоритет

# Пропустить определённые тесты
npm test -- -g "offline|sync" --grep-invert
```

---

## 📊 Просмотр результатов

### HTML отчёт

```bash
# Запустить тесты с HTML отчётом
npx playwright test --reporter=html

# Открыть отчёт
npx playwright show-report
```

### JSON отчёт

```bash
# JSON формат для CI/CD
npx playwright test --reporter=json > test-results.json
```

### Junit отчёт (для Jenkins)

```bash
# Junit XML для интеграции
npx playwright test --reporter=junit
```

---

## 🎯 Примеры запуска по сценариям

### Smoke Testing (быстрая проверка)

```bash
# Только базовые функции
npx playwright test tests/todoapp-critical-flows.spec.ts -g "TC-001|TC-002|TC-010" --workers=1

# Примерно: 5-10 минут
```

### Full Regression Testing

```bash
# Все тесты со всеми браузерами
npx playwright test --project=chromium --project=firefox --project=webkit

# Примерно: 30-45 минут
```

### Nightly Testing

```bash
# Все тесты + trace + screenshot
npx playwright test \
  --reporter=html \
  --trace=on \
  --screenshot=only-on-failure \
  --timeout=60000

# Примерно: 1-2 часа
```

### Focus on High Priority Features

```bash
npx playwright test tests/todoapp-high-priority.spec.ts \
  --headed \
  --workers=1 \
  --reporter=list
```

---

## 🛠️ Лучшие практики

### 1. Организация тестов

```typescript
// ❌ Плохо: все в одном файле
test('do everything', async ({ page }) => {
  // 100+ строк
});

// ✅ Хорошо: разделено по сценариям
test.describe('Task Management', () => {
  test('should create task', async ({ page }) => { });
  test('should edit task', async ({ page }) => { });
  test('should delete task', async ({ page }) => { });
});
```

### 2. Использование fixtures

```typescript
// ✅ Повторяемая подготовка
test.beforeEach(async ({ page }) => {
  await page.goto(APP_URL);
  await page.waitForLoadState('networkidle');
  // Очистить localStorage
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});
```

### 3. Надёжные селекторы

```typescript
// ❌ Хрупко: зависит от индекса
page.locator('button').first()

// ✓ Хорошо: по тексту или aria-label
page.locator('button:has-text("Save")')
page.locator('[aria-label="Add task"]')
page.locator('[data-testid="add-button"]')

// ✓ Лучше: комбинировать
page.locator('button').filter({ has: page.locator('text=Save') })
```

### 4. Явные ожидания

```typescript
// ✅ Правильно: явное ожидание
await expect(taskItem).toBeVisible({ timeout: 5000 });
await page.waitForLoadState('networkidle');

// ❌ Плохо: произвольная задержка
await page.waitForTimeout(2000);
```

### 5. Изоляция тестов

```typescript
// ✅ Каждый тест независим
test('scenario 1', async ({ page }) => {
  // Полная подготовка
  // Выполнение
  // Проверка
});

test('scenario 2', async ({ page }) => {
  // Не зависит от scenario 1
  // Полная подготовка
  // Выполнение
  // Проверка
});
```

### 6. Информативные сообщения об ошибках

```typescript
// ❌ Плохо
expect(count).toBe(5);

// ✅ Хорошо
expect(count).toBe(5, 'Should display 5 tasks after import');
```

---

## 🐛 Отладка

### Debug режим

```bash
# Запустить в debug режиме
npx playwright test --debug tests/todoapp-critical-flows.spec.ts

# Откроется Playwright Inspector с:
# - Пошаговым выполнением
# - Профилем селекторов
# - Логами
```

### Трассировка

```bash
# Запустить с полной трассировкой
npx playwright test --trace on

# Открыть trace viewer
npx playwright show-trace trace/...  
```

### Снимки экрана

```bash
// В тестах
test('should show error', async ({ page }) => {
  await page.goto(APP_URL);
  
  // Только при ошибке
  await page.screenshot({ path: 'screenshots/error.png' });
  
  // Или в config
});

// Команда
npx playwright test --screenshot=only-on-failure
```

### Visual Debugging

```typescript
// Пауза в браузере
await page.pause();

// Выполнить в контексте браузера
const result = await page.evaluate(() => {
  return document.title;
});
console.log(result);
```

---

## 🔄 CI/CD интеграция

### GitHub Actions

```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npx playwright install --with-deps
      
      - run: npx playwright test --project=${{ matrix.browser }}
      
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### GitLab CI

```yaml
# .gitlab-ci.yml
e2e-tests:
  image: mcr.microsoft.com/playwright:v1.40.0-focal
  script:
    - npm ci
    - npx playwright test
  artifacts:
    when: always
    paths:
      - playwright-report/
      - test-results/
    reports:
      junit: test-results/results.xml
```

### Jenkins

```groovy
pipeline {
  agent any
  
  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
        sh 'npx playwright install'
      }
    }
    
    stage('Test') {
      steps {
        sh 'npx playwright test --reporter=junit'
      }
    }
    
    stage('Report') {
      steps {
        junit 'test-results/results.xml'
        publishHTML([
          reportDir: 'playwright-report',
          reportFiles: 'index.html'
        ])
      }
    }
  }
}
```

---

## 📈 Расписание регулярных тестов

### Предложенный график

```
Smoke Tests (Быстро):
├─ На каждый commit (5-10 мин)
├─ Только критичные тесты
└─ Браузер: Chromium

Regression Tests (Полные):
├─ Каждый день в 2:00 UTC
├─ Все тесты
└─ Браузеры: Chromium, Firefox, WebKit

Performance Tests:
├─ Еженедельно (понедельник 9:00 UTC)
├─ Lighthouse + Playwright
└─ Анализ метрик
```

---

## 📝 Меню быстрых команд

```bash
# Сохраните эти команды как npm scripts в package.json

"test:critical": "playwright test tests/todoapp-critical-flows.spec.ts",
"test:high-priority": "playwright test tests/todoapp-high-priority.spec.ts",
"test:smoke": "playwright test -g 'TC-001|TC-002|TC-010' --workers=1",
"test:headed": "playwright test --headed --workers=1",
"test:debug": "playwright test --debug",
"test:report": "playwright test && playwright show-report",
"test:all": "playwright test",
"test:ci": "playwright test --reporter=html --reporter=junit",
```

Используйте:
```bash
npm run test:critical
npm run test:smoke
npm run test:debug
```

---

## 🎓 Дополнительные ресурсы

- [Playwright документация](https://playwright.dev)
- [Лучшие практики](https://playwright.dev/docs/best-practices)
- [Debugging](https://playwright.dev/docs/debug)
- [CI/CD](https://playwright.dev/docs/ci)

---

## ✅ Чек-лист перед запуском

- [ ] Node.js установлен (версия 16+)
- [ ] `npm install` выполнен
- [ ] `npx playwright install` выполнен
- [ ] TodoApp доступно на `https://react-cool-todo-app.netlify.app/`
- [ ] Браузер работает стабильно
- [ ] Нет прокси или firewall блокировки
- [ ] Достаточно места на диске (минимум 1GB для браузеров)
- [ ] Интернет соединение стабильное

---

**Документ последний раз обновлён**: 2026-06-08
