# ⚡ Quick Reference - TodoApp QA Automation

## 🎯 10-second Summary

**TodoApp**: React todo app с синхронизацией, импортом/экспортом, PWA поддержкой и P2P WebRTC синхром.

**10 Критичных потоков для тестирования**:
1. ✅ Create/Edit/Delete задач
2. ✅ Mark as done/undo
3. ✅ Фильтрация и поиск
4. ✅ WebRTC P2P синхронизация
5. ✅ Импорт/Экспорт JSON
6. ✅ Общий доступ (Share link/QR)
7. ✅ Переключение тем (Dark/Light)
8. ✅ Offline работа
9. ✅ PWA установка
10. ✅ Очистка данных

---

## 📂 Структура проекта

```
/Users/kavichki/Documents/AITest-1/
├── TodoApp_QA_Strategy.md              ← 📊 Полная стратегия
├── TESTING_GUIDE.md                    ← 🚀 Как запустить тесты
├── QA_METRICS_CHECKLIST.md             ← ✅ Метрики и чек-листы
├── tests/
│   ├── todoapp-critical-flows.spec.ts  ← КРИТИЧНЫЕ (TC-001+)
│   ├── todoapp-high-priority.spec.ts   ← ВЫСОКИЙ (TC-100+)
│   ├── test-examples.spec.ts           ← Примеры использования
│   └── utils/
│       └── test-helpers.ts             ← Утилиты и хелперы
└── playwright.config.ts                 ← Конфиг Playwright
```

---

## ⚡ Быстрые команды

```bash
# Запустить тесты
npm test

# Запустить только критичные
npm test tests/todoapp-critical-flows.spec.ts

# Debug режим
npx playwright test --debug

# С HTML отчётом
npx playwright test --reporter=html && npx playwright show-report

# Headed (видно браузер)
npx playwright test --headed --workers=1
```

---

## 🎨 Основные селекторы

```typescript
// Используйте из test-helpers.ts
SELECTORS.ADD_TASK_BTN       // Кнопка добавить
SELECTORS.SAVE_BTN           // Сохранить
SELECTORS.DELETE_BTN         // Удалить
SELECTORS.TASK_NAME_INPUT    // Input для названия
SELECTORS.SEARCH_INPUT       // Поиск
SELECTORS.TASK_ITEM          // Элемент задачи
```

---

## 💡 Типичный тест (3 шага)

```typescript
import { test, expect } from '@playwright/test';
import { createTask, completeTask, findTask } from './utils/test-helpers';

test('Create and complete a task', async ({ page }) => {
  // 1️⃣ Подготовка
  await page.goto('https://react-cool-todo-app.netlify.app/');
  
  // 2️⃣ Действие
  await createTask(page, 'Buy milk', 'Shopping', '🥛');
  await completeTask(page, 'Buy milk');
  
  // 3️⃣ Проверка
  const task = await findTask(page, 'Buy milk');
  expect(task).toBeTruthy();
});
```

---

## 🔧 Вспомогательные функции (Helpers)

### Создание и управление

```typescript
await createTask(page, 'Task name', 'Category', '🎯', 'Description');
await editTask(page, 'Old name', 'New name', 'New desc');
await completeTask(page, 'Task name');
await deleteTask(page, 'Task name');
```

### Поиск и фильтрация

```typescript
const task = await findTask(page, 'Task name');
const count = await getTaskCount(page);
const all = await getAllTasks(page);
await searchTasks(page, 'search term');
await filterByCategory(page, 'Work');
```

### Персонализация

```typescript
await toggleTheme(page);
const isDark = await isDarkMode(page);
```

### Синхронизация

```typescript
const exportPath = await exportTasks(page);
await importTasks(page, exportPath);
await clearStorage(page);
```

### Offline

```typescript
await goOffline(page, context);
await goOnline(page, context);
```

---

## 📊 Тестовые примеры (Quick Copy-Paste)

### Пример 1: Полный цикл задачи

```typescript
test('Full task lifecycle', async ({ page }) => {
  await page.goto(APP_URL);
  
  // Создать
  await createTask(page, 'Test', 'Work');
  
  // Отредактировать
  await editTask(page, 'Test', 'Updated Test');
  
  // Отметить выполненной
  await completeTask(page, 'Updated Test');
  
  // Проверить статистику
  const stats = await getTaskStats(page);
  expect(stats.completed).toBeGreaterThanOrEqual(1);
  
  // Удалить
  await deleteTask(page, 'Updated Test');
});
```

### Пример 2: Импорт/Экспорт

```typescript
test('Export and reimport tasks', async ({ page }) => {
  await createTask(page, 'Task to export', 'Work');
  
  const filePath = await exportTasks(page);
  expect(filePath).toBeTruthy();
  
  await clearStorage(page);
  const countAfterClear = await getTaskCount(page);
  expect(countAfterClear).toBe(0);
  
  await importTasks(page, filePath);
  const countAfterImport = await getTaskCount(page);
  expect(countAfterImport).toBeGreaterThanOrEqual(1);
});
```

### Пример 3: Offline работа

```typescript
test('Works offline', async ({ page, context }) => {
  await createTask(page, 'Online task', 'Work');
  
  await goOffline(page, context);
  await createTask(page, 'Offline task', 'Personal');
  
  const task1 = await findTask(page, 'Online task');
  const task2 = await findTask(page, 'Offline task');
  expect(task1).toBeTruthy();
  expect(task2).toBeTruthy();
  
  await goOnline(page, context);
  await page.reload();
  
  expect(await findTask(page, 'Online task')).toBeTruthy();
  expect(await findTask(page, 'Offline task')).toBeTruthy();
});
```

---

## 🎯 Критичные TC номера

```
TC-001 до TC-009   → Создание/редактирование/удаление
TC-010 до TC-019   → Фильтры и поиск
TC-020 до TC-029   → Импорт/Экспорт
TC-030 до TC-039   → Темы и персонализация
TC-040 до TC-049   → Категории
TC-050 до TC-059   → Edge cases
TC-100 до TC-149   → High Priority (Sync, Share)
```

---

## 🔍 Отладка

### Debug режим
```bash
npx playwright test --debug
```
Откроется Inspector, где можно:
- Пошагово выполнять тест
- Инспектировать элементы
- Видеть селекторы
- Читать логи

### Трассировка
```bash
npx playwright test --trace on
npx playwright show-trace trace/trace.zip
```

### Скриншоты при ошибке
```bash
npx playwright test --screenshot=only-on-failure
```

### Просмотр отчёта
```bash
npx playwright show-report
```

---

## 📈 Метрики для отслеживания

| Метрика | Целевое | Формула |
|---------|---------|---------|
| Coverage | 80%+ | Пройденные функции / Все функции |
| Pass Rate | 95%+ | Passed / Total |
| Flaky | <5% | Нестабильные / Total |
| Execution Time | <30min | Sum всех тестов |

---

## 🚀 CI/CD интеграция

### GitHub Actions пример

```yaml
- name: Run Playwright Tests
  run: npx playwright test
  
- name: Upload Report
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

---

## ❌ Частые ошибки и решения

### Ошибка: "Selector not found"
**Решение**: Используйте SELECTORS из helpers или проверьте app структуру
```typescript
// ❌ Неправильно
page.locator('button').first().click()

// ✅ Правильно
page.locator('button:has-text("Save")').first().click()
```

### Ошибка: "Timeout waiting for selector"
**Решение**: Увеличьте timeout или добавьте waitForLoadState
```typescript
// ✅ Правильно
await page.waitForLoadState('networkidle');
await page.locator(selector, { timeout: 10000 });
```

### Ошибка: "localStorage is empty"
**Решение**: Не очищайте localStorage если нужны данные
```typescript
// ❌ Неправильно
await page.evaluate(() => localStorage.clear());

// ✅ Правильно (только в setup/teardown)
await clearStorage(page); // В beforeEach
```

### Ошибка: "Tests are flaky"
**Решение**: Используйте явные ожидания
```typescript
// ❌ Неправильно
await page.waitForTimeout(2000);

// ✅ Правильно
await expect(element).toBeVisible({ timeout: 5000 });
```

---

## 📚 Полная документация

| Документ | Описание |
|----------|---------|
| TodoApp_QA_Strategy.md | 📊 Полная архитектура и потоки |
| TESTING_GUIDE.md | 🚀 Запуск тестов и CI/CD |
| QA_METRICS_CHECKLIST.md | ✅ Метрики и чек-листы |
| test-helpers.ts | 💡 Готовые функции для тестов |
| test-examples.spec.ts | 📝 Примеры реальных тестов |

---

## 📞 Контакты и ресурсы

- **TodoApp**: https://react-cool-todo-app.netlify.app/
- **GitHub**: https://github.com/maciekt07/TodoApp
- **Playwright Docs**: https://playwright.dev
- **Playwright Inspector**: `--debug` флаг

---

## ✅ Before Running Tests

- [ ] `npm install` - установить зависимости
- [ ] `npx playwright install` - установить браузеры
- [ ] Интернет работает
- [ ] TodoApp доступно
- [ ] Браузер не открыт на приложении
- [ ] Достаточно памяти (1GB+)

---

## 🎓 Необходимые знания

**Обязательно**:
- JavaScript/TypeScript базовый уровень
- Async/await
- Playwright API

**Желательно**:
- CSS селекторы
- DevTools браузера
- Git
- CI/CD (GitHub Actions/GitLab CI)

---

## 📝 Шаблон нового теста

```typescript
import { test, expect } from '@playwright/test';
import { 
  createTask, 
  completeTask, 
  findTask,
  getTaskCount 
} from './utils/test-helpers';

test('TC-XXX: Descriptive test name', async ({ page }) => {
  // SETUP
  await page.goto('https://react-cool-todo-app.netlify.app/');
  
  // ACTION
  // Your test steps here
  
  // ASSERTION
  // Verify expected results
});
```

---

## 🎯 Путь новичка (First Week)

```
День 1-2:  Прочитать документацию
День 3-4:  Запустить примеры из test-examples.spec.ts
День 5:    Написать свой первый тест TC-001
День 6:    Написать TC-002, TC-003, TC-004
День 7:    Расширить на высокоприоритетные (TC-100+)
```

---

**Версия**: 1.0  
**Последнее обновление**: 2026-06-08  
**Статус**: ✅ Ready for Use

