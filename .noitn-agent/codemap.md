# Noitn - Code Map

Architecture overview for quick reference.

---

## Layer Architecture

```
┌─────────────────────────────────────┐
│  UI Layer (React + shadcn)          │
│  /src/components/*                  │
├─────────────────────────────────────┤
│  Feature Layer                       │
│  /src/features/*                    │
├─────────────────────────────────────┤
│  Service Layer                       │
│  /src/lib/* (storage, ai, etc)      │
├─────────────────────────────────────┤
│  Platform Layer (Electron IPC)      │
│  /src/main/* (main process)         │
└─────────────────────────────────────┘
```

---

## Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Root component |
| `src/lib/storage.ts` | JSON file operations |
| `src/lib/ai-scope.ts` | AI allowed imports |
| `src/components/editor/Editor.tsx` | Lexical editor |
| `src/components/widgets/*` | Widget components |

---

## Dependency Flow

```
UI → Hooks → Services → Platform
                  ↓
              Stores (React Context)
```

## DI Pattern

Services injected via props or context:
```tsx
// Option 1: Props
<Component storage={storage} ai={ai} />

// Option 2: Context
const { storage, ai } = useServices()
```
