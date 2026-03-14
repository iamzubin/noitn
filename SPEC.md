# Noitn - Specification

## Project Overview

**Project Name:** Noitn  
**Type:** Local-first desktop application  
**Core Functionality:** A hybrid block-based workspace combining rich text notes with AI-generated interactive widgets. All data stored locally in JSON files.

---

## Technology Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Desktop | **Electron** | Cross-platform desktop |
| Frontend | React + TypeScript + Vite | UI framework |
| Editor | **Lexical** | Rich text editor from Meta/Facebook |
| UI Components | **shadcn/ui** | Accessible, customizable components |
| AI SDK | **Vercel AI SDK** | Unified API for OpenAI, Google, Ollama |
| Storage | **JSON files** | Local files in app data folder |
| State | React Context + Lexical state | Simple state management |

### Why Electron?
- Mature, stable platform
- Large ecosystem
- Cross-platform (macOS, Windows, Linux)
- Good IPC support

### Why Lexical?
- From Meta/Facebook (used in Instagram, WhatsApp)
- Highly extensible
- Great TypeScript support
- Declarative node system perfect for widgets

### Why shadcn/ui?
- Copy-paste components (no external dependency)
- Full control over code (AI can modify directly)
- Beautiful defaults with Tailwind
- All components exportable for AI scope

---

## AI / LLM Providers (BYOK)

| Provider | Auth | Models |
|----------|------|--------|
| **OpenAI** | API Key | GPT-4o, GPT-4o-mini |
| **Google AI** | API Key | Gemini 2.0 Flash |
| **Ollama** | Local | Any Ollama model |

Users provide their own API keys or use local Ollama. API keys stored in app config.

### AI Widget Generation
- AI generates widgets using shadcn/ui components only
- Scope file (`/src/lib/ai-scope.ts`) exports all allowed components
- AI can access: React hooks, lucide-react icons, shadcn components, backend IPC
- System prompt restricts AI to only allowed imports

---

## Core Features

1. **Block-Based Editing** - Lexical-powered rich text with slash commands
2. **AI Widget Generation** - Generate widgets via AI from context
3. **Widget Designer** - Right-click widget → "Edit Widget" opens designer panel
4. **Context-Aware** - AI sees text around cursor for relevant widgets
5. **Sidebar Navigation** - Switch between documents
6. **Local JSON Storage** - No cloud, all data in app folder
7. **Light/Dark Theme** - Sunset Noir with toggle

---

## UI/UX

### Theme: Sunset Noir

**Dark Mode:**
- Background: `#000000`
- Surface: `#09090b` (zinc-950)
- Text: `#fafafa` (zinc-50)
- Accent: `#FF4F11` (orange)

**Light Mode:**
- Background: `#fafafa`
- Surface: `#ffffff`
- Text: `#18181b` (zinc-900)
- Accent: `#FF4F11` (orange)

### Components (shadcn/ui)
All UI built with shadcn/ui:
- Button, Card, Input, Table
- Tabs, Accordion, Dialog, Drawer
- DropdownMenu, Select, Switch, Slider
- ScrollArea, Tooltip, Separator

### Widget Designer
- Right-click any widget → context menu with "Edit Widget" option
- Opens a Drawer panel on the right with:
  - Widget type selector (dropdown)
  - Property editors based on widget type
  - Live preview
  - "Save" and "Cancel" buttons
- Designer saves back to widget state on confirm
- Supports all shadcn form components for editing

---

## Data Model

### Documents (JSON)
```
{
  "id": "uuid",
  "title": "My Document",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

### Blocks (JSON)
```
{
  "id": "uuid",
  "documentId": "uuid",
  "type": "paragraph" | "heading" | "widget" | "list",
  "content": "string | JSON",
  "parentId": "uuid | null",
  "orderIndex": number
}
```

### Widget Schemas (JSON)
```
{
  "id": "uuid",
  "name": "Expense Tracker",
  "uiBlueprint": { /* shadcn component config */ },
  "createdAt": "ISO timestamp"
}
```

### Storage Location
- macOS: `~/Library/Application Support/Noitn/data/`
- Windows: `%APPDATA%/Noitn/data/`
- Linux: `~/.config/Noitn/data/`

---

## App Structure

```
src/
├── components/
│   ├── ui/                    # shadcn components (generated)
│   ├── editor/
│   │   ├── Editor.tsx         # Main Lexical editor
│   │   ├── Toolbar.tsx        # Formatting toolbar
│   │   ├── SlashMenu.tsx      # Slash command menu
│   │   └── nodes/             # Custom Lexical nodes
│   ├── widgets/
│   │   ├── WidgetRenderer.tsx # Renders widget by type
│   │   ├── WidgetDesigner.tsx # Edit widget in drawer
│   │   ├── KanbanWidget.tsx
│   │   ├── TableWidget.tsx
│   │   └── CardWidget.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx        # Document list
│   │   └── Layout.tsx         # Main layout wrapper
│   └── ThemeToggle.tsx        # Dark/light toggle
├── lib/
│   ├── ai-scope.ts            # AI allowed imports
│   ├── storage.ts             # JSON file operations
│   └── ai.ts                 # AI SDK setup
├── stores/
│   └── documentStore.ts       # Document state
├── hooks/
│   └── useAI.ts               # AI generation hook
├── App.tsx
└── main.tsx
```

---

## Development Phases

1. **Phase 1:** Electron + React + shadcn setup
2. **Phase 2:** Lexical editor integration
3. **Phase 3:** Sidebar + document navigation
4. **Phase 4:** Widget system (insert, edit, persist)
5. **Phase 5:** AI integration (generate widgets)
6. **Phase 6:** Polish + testing

---

## Security

- No arbitrary JSX from LLM
- Declarative schema mapping only (AI outputs JSON config)
- API keys stored locally (not synced)
- Electron IPC isolation
- No network calls except user-initiated AI requests
