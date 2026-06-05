# Scheduler

Plan your weekly routines. Drag events, resize them, export schedules. Built for desktop.

## Features

- Weekly calendar with drag-and-drop events
- Daily view with current task suggestion
- Shift+drag to duplicate events
- Resize events by dragging edges
- Custom categories with color picker
- Undo/redo (Ctrl+Z / Ctrl+Shift+Z)
- Export to JSON, PDF, PNG
- Local persistence (no account needed)
- JSON import/export for backups

## Tech Stack

- React 19
- TypeScript
- Zustand (state management)
- dnd-kit (drag and drop)
- shadcn/ui
- Tailwind CSS
- Vite

## Setup

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Local Storage

All data stays in your browser. Keys use a `scheduler-` prefix:

- `scheduler-events` — your events
- `scheduler-categories` — category definitions
- `scheduler-settings` — time resolution, day bounds, week start

Clearing these keys resets the app to defaults. Export to JSON before clearing if you want a backup.

## Links

- Source: [github.com/AlaminIsCoding/scheduler](https://github.com/AlaminIsCoding/scheduler)
- Live: https://scheduler.alamin.work
