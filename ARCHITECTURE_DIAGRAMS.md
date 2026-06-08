# 🏗️ Архитектура TodoApp - Визуальные диаграммы

## Диаграмма 1: Общая архитектура системы

```
┌────────────────────────────────────────────────────────────────┐
│                         Браузер Пользователя                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    React Frontend (UI)                  │  │
│  │  ┌──────────┬──────────┬──────────┬──────────┐         │  │
│  │  │TasksList │EditTask  │Settings  │ShareDialog         │  │
│  │  └────┬─────┴────┬─────┴────┬─────┴────┬─────┘         │  │
│  │       │          │          │          │                │  │
│  │  ┌────▼──────────▼──────────▼──────────▼─────────────┐  │  │
│  │  │    Context & State Management (Hooks)            │  │  │
│  │  │  ┌──────────────┬──────────────┬──────────────┐  │  │  │
│  │  │  │ UserContext  │ TaskContext  │ Custom Hooks│  │  │  │
│  │  │  └──────────────┴──────────────┴──────────────┘  │  │  │
│  │  └────┬────────────────────────────────────────────┘  │  │
│  │       │                                                │  │
│  │  ┌────▼────────────────────────────────────────────┐  │  │
│  │  │     Utilities & Business Logic Layer            │  │  │
│  │  │  ┌──────┬────────┬─────────┬──────┐            │  │  │
│  │  │  │Sync  │Export  │Validate │Color │            │  │  │
│  │  │  └──────┴────────┴─────────┴──────┘            │  │  │
│  │  └────┬────────────────────────────────────────────┘  │  │
│  │       │                                                │  │
│  └───────┼────────────────────────────────────────────────┘  │
│          │                                                   │
│  ┌───────▼────────────────────────────────────────────────┐  │
│  │         Data Persistence Layer                        │  │
│  │  ┌───────────┬──────────────┬──────────────────────┐  │  │
│  │  │LocalStorage│IndexedDB    │Service Worker Cache  │  │  │
│  │  └───────────┴──────────────┴──────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         WebRTC P2P Module (для синхронизации)       │  │
│  │       Soединяется только с другими девайсами        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└────────────────────────────────────────────────────────────────┘
                            ▼
                    Интернет (опционально)
                            ▼
                 ┌──────────────────────┐
                 │  Another Device (P2P)│  ← WebRTC sync
                 │  или Share Link      │
                 └──────────────────────┘
```

---

## Диаграмма 2: Поток данных (Data Flow)

```
User Action (Click, Input)
        │
        ▼
    Component Handler
        │
        ├─ Update UI State (React setState)
        │
        ├─ Update Context (UserContext / TaskContext)
        │
        ├─ Call Business Logic (Utils)
        │
        ▼
    Persist to Storage
        │
        ├─ Save to localStorage
        │
        ├─ Save to IndexedDB (если есть большой объём)
        │
        └─ Sync via WebRTC (если другой девайс подключен)
                    │
                    ├─ Compress data
                    │
                    ├─ Send via P2P connection
                    │
                    └─ Other device receives & merges data
```

---

## Диаграмма 3: Жизненный цикл задачи

```
┌─────────────┐
│  Начало     │
└──────┬──────┘
       │
       ▼
   ┌────────────────┐
   │ Создать задачу │
   │ ├─ Название    │
   │ ├─ Описание     │
   │ ├─ Категория    │
   │ ├─ Дата         │
   │ └─ Эмодзи       │
   └────────┬────────┘
            │
            ▼
   ┌────────────────────┐
   │ Сохранить в        │
   │ ├─ LocalStorage     │
   │ ├─ React State      │
   │ └─ IndexedDB        │
   └────────┬────────────┘
            │
            ▼
   ┌────────────────────────┐
   │ Отобразить в списке    │
   │ ├─ Можно отредактировать
   │ ├─ Можно отметить done  │
   │ └─ Можно удалить        │
   └────────┬───────────────┘
            │
        ┌───┴────┬────────┐
        │        │        │
        ▼        ▼        ▼
    EDIT    COMPLETE   DELETE
        │        │        │
        │        ▼        │
        │   ┌─────────┐   │
        │   │ Зачёркун│   │
        │   └─────────┘   │
        │        │        │
        └───┬────┴────┬───┘
            │         │
            ▼         ▼
        Синхронизация / Экспорт
            │         │
            └────┬────┘
                 │
                 ▼
          ┌─────────────────┐
          │ Сохранено/Синхро│
          └─────────────────┘
```

---

## Диаграмма 4: Компоненты и их связи

```
┌─────────────────────────────────────────────────────────────┐
│                         App.tsx (Root)                       │
└─────────────────────────────────────────────────────────────┘
              │                    │                    │
    ┌─────────┴─────────┬──────────┴──────────┬────────┴─────────┐
    │                   │                     │                  │
    ▼                   ▼                     ▼                  ▼
┌────────────┐     ┌──────────┐         ┌──────────┐      ┌──────────┐
│  TasksList │     │ AddTask  │         │Categories│      │Settings  │
│            │     │          │         │          │      │ Dialog   │
│ ├─TaskItem │     ├─Emoji    │         ├─Color    │      ├─Themes   │
│ ├─Filter   │     ├─Category │         │Picker    │      ├─Export   │
│ ├─Search   │     └─DatePick │         │          │      ├─Import   │
│ └─Sort     │                │         └──────────┘      └──────────┘
└────────────┘                │
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
              ┌──────────────┐    ┌──────────────┐
              │ EditTask     │    │ShareDialog   │
              │              │    │              │
              ├─NameField    │    ├─LinkCopy    │
              ├─DescField    │    ├─QRCode      │
              ├─EmojiPicker  │    ├─Export      │
              └─DatePicker   │    └─Sync UI     │
                             │
                   ┌─────────┴─────────┐
                   │                   │
                   ▼                   ▼
             ┌────────────┐     ┌────────────┐
             │ Sync Page  │     │Transfer    │
             │            │     │(WebRTC)    │
             ├─QRGenerator│     ├─P2PConnect │
             ├─QRScanner  │     ├─DataMerge  │
             └─Status     │     └─Compress   │
                          │
                ┌─────────┴─────────┐
                │                   │
                ▼                   ▼
          ┌──────────────┐   ┌────────────────┐
          │ UserContext  │   │ TaskContext    │
          ├─user state   │   ├─tasks array    │
          ├─settings     │   ├─categories     │
          ├─theme        │   ├─filters        │
          └─categories   │   └─search query   │
                         │
                         ▼
            ┌────────────────────────┐
            │ Persistence Layer      │
            │ ├─ LocalStorage        │
            │ ├─ IndexedDB           │
            │ └─ Service Worker      │
            └────────────────────────┘
```

---

## Диаграмма 5: Критичные пользовательские потоки

```
┌────────────────────────────────────────────────────────────┐
│           КРИТИЧНЫЕ ПОЛЬЗОВАТЕЛЬСКИЕ ПОТОКИ                │
└────────────────────────────────────────────────────────────┘

ПОТОК 1: CRUD операции
  User → Open App → Add Task → (Edit → Delete) → Persist Data
                                                ↓
                                        LocalStorage
                                        
ПОТОК 2: Фильтрация и Поиск
  User → Select Filter → View Filtered Tasks → Search
                                              ↓
                                        IndexedDB Query
                                        
ПОТОК 3: Синхронизация (WebRTC)
  Device A               Network              Device B
    │                      │                     │
    ├──→ Generate QR ─────→ │                     │
    │                      │                     │
    │                      │ ←─ Scan QR ←────────┤
    │                      │                     │
    ├──→ WebRTC Connect ←──┤                     │
    │                      │ ←─ P2P Established ─┤
    │                      │                     │
    ├──→ Send Data ───────→ │ ←─ Receive ────────┤
    │                      │                     │
    └──→ Merge & Persist   ├──→ Merge & Persist ─┘
         (Done)            │    (Done)
         
ПОТОК 4: Импорт/Экспорт
  Tasks in Memory
       │
       ├─→ Export
       │   └─→ JSON File
       │       └─→ Download
       │
       └─→ Import
           ├─→ Select File
           ├─→ Parse JSON
           └─→ Merge with Existing
               └─→ Save to Storage

ПОТОК 5: Общий доступ (Sharing)
  Task Selected
       │
       ├─→ Generate Link
       │   └─→ Encode Task Data
       │       └─→ Create Share URL
       │           └─→ Copy to Clipboard
       │
       └─→ Generate QR
           └─→ Render QR Code
               └─→ Save/Share

ПОТОК 6: Offline Работа
  Online State
       │
       ├─→ Create Task
       │   └─→ Save to localStorage
       │
       └─→ Go Offline
           ├─→ Service Worker activates
           ├─→ Can still view cached tasks
           ├─→ Can create new tasks
           └─→ Go Online
               └─→ Sync with cloud (if exists)
               
ПОТОК 7: Персонализация
  Settings → Select Theme
               │
               ├─→ Apply Theme
               ├─→ Update All UI
               ├─→ Save Preference
               └─→ Persist on Reload
```

---

## Диаграмма 6: Хранилище данных и их структуры

```
┌──────────────────────────────────────────────────────────┐
│              LocalStorage Structure                       │
│                                                          │
│  "tasks" → Array of {                                    │
│    id: UUID                                              │
│    name: string (max 256)                                │
│    description: string (max 2048)                        │
│    category_id: UUID                                     │
│    completed: boolean                                    │
│    emoji: string                                         │
│    dueDate: ISO Date or null                             │
│    createdAt: ISO Date                                   │
│    updatedAt: ISO Date                                   │
│    syncedAt: ISO Date or null                            │
│  }                                                        │
│                                                          │
│  "categories" → Array of {                               │
│    id: UUID                                              │
│    name: string                                          │
│    color: hex string                                     │
│    icon: string (emoji)                                  │
│  }                                                        │
│                                                          │
│  "settings" → {                                          │
│    theme: 'light' | 'dark' | 'auto'                      │
│    language: string                                      │
│    sortBy: 'date' | 'name' | 'priority'                  │
│    voiceVolume: 0-100                                    │
│    ... other user settings                               │
│  }                                                        │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│           IndexedDB Structure (Large Data)                │
│                                                          │
│  Database: "TodoApp"                                     │
│  │                                                       │
│  ├─ Store: "tasks" (keyPath: "id")                       │
│  │  └─ Index: "category_id", "completed", "dueDate"     │
│  │                                                       │
│  ├─ Store: "categories" (keyPath: "id")                  │
│  │                                                       │
│  ├─ Store: "sync_history" (keyPath: "timestamp")         │
│  │                                                       │
│  └─ Store: "exports" (keyPath: "id")                     │
│     └─ Large JSON exports stored here                    │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│         Service Worker Cache Strategy                     │
│                                                          │
│  Cache: "v1-static"                                      │
│  ├─ index.html                                           │
│  ├─ main.js (app bundle)                                 │
│  ├─ styles.css                                           │
│  ├─ assets/ (images, icons)                              │
│  └─ fonts/                                               │
│                                                          │
│  Cache: "v1-dynamic"                                     │
│  └─ API responses (if any)                               │
└──────────────────────────────────────────────────────────┘
```

---

## Диаграмма 7: WebRTC P2P синхронизация (подробно)

```
Device A (Initiator)          Network            Device B (Responder)
    │                            │                         │
    ├─ Generate UUID ─────────────────────────────────────→ ┼
    │   (for connection)                                    │
    │                                                       │
    ├─ Create Peer("uuid_A")                               │
    │   ├─ Generate SDP Offer                              │
    │   └─ Ready to connect                                │
    │                                                       │
    ├─ Generate QR Code                                    │
    │   (contains connection info)                         │
    │                                                       │
    │   QR Code scanned by user                           │
    │   │                                                   │
    │   └──────────────────────────────────────────→ ┼ Device B scans
    │                                                  │
    │                                                  ├─ Create Peer("uuid_B")
    │                                                  ├─ Connect to uuid_A
    │                                                  │
    │   ←──────────────────────────────────────────┼─ Send Connection Request
    │   (ICE candidates exchange)                   │
    │                                                  │
    ├─ Accept Connection                            │
    ├─ DataConnection established                   │
    │                                                  ├─ Connection ready
    │                                                  │
    ├─ Serialize tasks                              │
    ├─ Compress data (gzip)                         │
    ├─ Send via DataConnection ──────────────→ ┼─ Receive compressed
    │                                            │   data
    │                                            ├─ Decompress
    │                                            ├─ Merge with local tasks
    │   ←────────────────────────────────────┼─ Send ACK + Device B tasks
    │   Receive Device B data
    ├─ Merge with local tasks
    ├─ Persist to localStorage
    │
    ├─ Show "Sync Complete" ─────────────────→ ┼─ Show "Sync Complete"
    │
    └─ Monitor connection ─────────────────────┼─ Monitor connection
       (for re-sync if needed)                   (for re-sync if needed)
```

---

## Диаграмма 8: Состояния задачи (State Machine)

```
                    ┌─────────────────┐
                    │  Not Existing   │
                    └────────┬────────┘
                             │
                      User creates task
                             │
                             ▼
                    ┌─────────────────┐
                    │  Creating...    │
                    └────────┬────────┘
                             │
                      Validate + Save
                             │
                             ▼
                    ┌─────────────────┐
                    │  Pending        │◄──────┐
                    │  (Not Done)     │       │
                    └────────┬────────┘       │
                             │                │
                    ┌────────┴────────┐       │
                    │                 │       │
                    │ User clicks     │ User unchecks
                    │ checkbox        │
                    │                 │
                    ▼                 │
            ┌──────────────────┐      │
            │ Completing...    │      │
            │ (animating)      │      │
            └──────────┬───────┘      │
                       │              │
                       ▼              │
            ┌──────────────────┐      │
            │ Completed        │──────┘
            │ (strikethrough)  │
            └──────────┬───────┘
                       │
                User deletes
                       │
                       ▼
            ┌──────────────────┐
            │ Deleting...      │
            │ (confirm dialog) │
            └──────────┬───────┘
                       │
                    Confirmed
                       │
                       ▼
            ┌──────────────────┐
            │ Deleted          │
            │ (removed from UI)│
            └──────────────────┘
```

---

## Диаграмма 9: Тестовая пирамида

```
                              ▲
                            / | \
                          /   |   \
                        / E2E  |    \
                      /--------+--------\        < 10% (High Cost)
                    /  Smoke   |         \
                  /--------+---+---+-------\     < 30% (Medium Cost)
                /  Integration  |        \
              /--------+--------+---------+\    < 60% (Low Cost)
            /   Unit & Component Tests    |
          /_____________________________|____\  < 100% (Baseline)

Test Distribution:
- Unit/Component: 60% (Fast, Cheap)
- Integration: 30% (Medium Speed, Medium Cost)
- E2E/Smoke: 10% (Slow, Expensive, High Value)
```

---

## Диаграмма 10: CI/CD Pipeline

```
┌──────────────────────────────────────────────────────────┐
│              Developer pushes code                       │
└──────────────────────────────────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────────┐
        │  1. Lint & Format Check (5 min)   │
        │  eslint, prettier                  │
        └───────────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────────┐
        │  2. Unit & Component Tests (10min)│
        │  Vitest coverage ≥ 75%            │
        └───────────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────────┐
        │  3. Build Check (5 min)           │
        │  Vite build successful            │
        └───────────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────────┐
        │  4. E2E Smoke Tests (10 min)      │
        │  Playwright critical flows        │
        └───────────────────────────────────┘
                        │
                ┌───────┴───────┐
                │               │
                ▼               ▼
            ✅ All Pass    ❌ Failed
                │               │
                ▼               ▼
        ┌────────────┐   ┌──────────────┐
        │Deploy to   │   │Block Merge   │
        │Staging     │   │Show Error Log│
        └────┬───────┘   └──────────────┘
             │
             ▼
        ┌───────────────────────────────────┐
        │  5. Staging Tests (15 min)        │
        │  Parallel: Chrome, Firefox, Safari│
        │  Coverage check                   │
        └────────────┬──────────────────────┘
                     │
             ┌───────┴───────┐
             │               │
             ▼               ▼
         ✅ Pass        ❌ Failed
             │               │
             ▼               ▼
        Deploy to      Create Issue
        Production     + Assign to Dev
        
        Production Ready ✅
```

---

**Визуализация завершена** ✅

Эти диаграммы помогают понять:
- 📐 Общую архитектуру системы
- 🔄 Потоки данных между компонентами
- 🎯 Критичные пользовательские сценарии
- 💾 Структуру хранилища данных
- 🌐 P2P синхронизацию через WebRTC
- 🧪 Тестовую пирамиду
- 🚀 CI/CD процесс

