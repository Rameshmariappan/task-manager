# Task Manager

Take-home built with Next.js 16.2.9, React 19, TypeScript, Tailwind CSS v4, and shadcn/ui.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000/task-manager](http://localhost:3000/task-management).

```bash
npm run test   # Vitest unit tests
```

## Structure

```
app/task-manager/page.tsx   — single "use client" boundary, all state and handlers
src/BLL/taskManager/        — TaskManager class + unit tests
src/components/taskManager/ — UI components
src/lib/                    — useLocalStorage, date utils, form helpers
```

## How reactivity works

`TaskManager` is a plain TS class, invisible to React. `page.tsx` holds a `useState(0)` counter and passes an increment callback into the constructor. Every mutating method calls it, which triggers a re-render. The instance lives in a `useRef` so it's created once and survives re-renders.

Date parsing always uses `new Date(year, month - 1, day)` instead of `new Date('YYYY-MM-DD')` — the ISO string form parses as UTC, which shifts the date backward by a day in UTC+ timezones.

## Notes

- Drag-and-drop is mouse-only. Use Edit to change a task's status via keyboard.
- `crypto.randomUUID()` requires HTTPS or localhost — plain HTTP will throw on task creation.
- Sort preference resets on refresh; only the active view (Kanban/List) is persisted to localStorage.
