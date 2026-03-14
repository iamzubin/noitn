# Noitn - Code Map

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  UI Layer (React + shadcn)                         │
│  /src/components/ui/*  - shadcn components         │
│  /src/components/Layout.tsx - App layout            │
│  /src/components/editor/ - Lexical editor           │
├─────────────────────────────────────────────────────┤
│  State Layer (Zustand)                              │
│  /src/stores/documentStore.ts - Document state      │
├─────────────────────────────────────────────────────┤
│  Service Layer                                      │
│  /src/lib/storage.ts - File operations (IPC)       │
│  /src/lib/utils.ts - Utility functions            │
├─────────────────────────────────────────────────────┤
│  Electron (Main Process)                            │
│  main.ts - Window management, IPC handlers          │
│  preload.ts - Expose APIs to renderer              │
└─────────────────────────────────────────────────────┘
```

## Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Root component, renders Sidebar + Editor |
| `src/components/Layout.tsx` | App shell with titlebar, sidebar, main |
| `src/components/editor/Editor.tsx` | Lexical editor with load/save plugins |
| `src/stores/documentStore.ts` | Zustand store for documents |
| `src/lib/storage.ts` | JSON file read/write via IPC |
| `main.ts` | Electron main process |
| `preload.ts` | Bridge between main and renderer |

## Data Flow

```
User Types → Lexical → SaveContentPlugin (debounced 1s)
           → documentStore.saveCurrentBlocks()
           → storage.saveBlocks()
           → IPC: writeFile → Main Process → fs

Select Doc → documentStore.selectDocument()
           → storage.loadBlocks()
           → IPC: readFile → LoadContentPlugin → Editor
```

## Storage

- Location: `{appDataPath}/noitn/`
- Documents: `documents/{id}.json` - metadata only
- Blocks: `blocks/{id}.json` - Lexical JSON state

## IPC APIs (preload.ts)

```typescript
window.electronAPI {
  getAppPath() → Promise<string>
  getVersion() → Promise<string>
  ensureDir(path) → Promise<boolean>
  readDir(path) → Promise<string[]>
  readFile(path) → Promise<string | null>
  writeFile(path, content) → Promise<boolean>
  deleteFile(path) → Promise<boolean>
}
```

## Titlebar

- Custom frameless window with `frame: false`
- Drag region via `WebkitAppRegion: drag`
- Traffic light spacing: `pl-16` for macOS alignment
- z-index: 100 to overlay content

## Widget System

- `src/components/editor/widgets/WidgetNode.tsx` - Lexical DecoratorNode for widgets
- `src/components/editor/widgets/WidgetComponent.tsx` - React component for widget UI
- `src/components/editor/widgets/WidgetDesigner.tsx` - Drawer for editing widget properties
- `src/components/editor/widgets/registry.tsx` - Widget type definitions and configs
- Widget types: timer, checkbox, counter, table, placeholder

### Inserting Widgets

- Type `/` in editor to open slash command menu
- Widget options appear at bottom of menu
- Select widget type to insert at cursor position
