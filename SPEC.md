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

### Editor (Lexical)
- **Block-Based Editing** - Lexical-powered rich text
- **Slash Commands** - Type `/` for quick block insertion (headings, lists, quotes, code)
- **Floating Toolbar** - Notion-style bubble on text selection (bold, italic, underline, headings)
- **Keyboard Shortcuts** - Ctrl+B/I/U for formatting, Ctrl+1/2/3 for headings
- **Draggable Blocks** - Hover to show + and grip handle, drag to reorder
- **Block Types** - Paragraph, Headings (H1-H3), Lists (bullet/numbered), Quotes, Code blocks

### Documents
- **Sidebar Navigation** - List all documents, click to switch
- **Create Document** - New button in sidebar
- **Delete Document** - Trash icon on hover
- **Rename Document** - Double-click title to edit
- **Auto-Save** - Debounced 1 second after typing stops
- **Save on Switch** - Automatically saves when switching documents

### Version History
- **Git-like Timeline** - Tree-based version history per document
- **Smart Merging** - <10% word change = merge into previous version
- **New Block Detection** - New block types (widgets, lists) always create new version
- **Version on Switch** - Creates version when switching documents

### UI/Theme
- **Sunset Noir Theme** - Dark mode with orange accents (#FF4F11)
- **Light/Dark Toggle** - Header button to switch themes
- **Custom Titlebar** - Frameless window with custom controls

### AI (Future)
- **Widget Generation** - Generate widgets via AI from context
- **Widget Designer** - Right-click widget → "Edit Widget" opens designer panel
- **Context-Aware** - AI sees text around cursor for relevant widgets

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

### Timeline / Version History (Implemented)

**Smart Versioning:**
- Creates version on auto-save AND document switch
- Merges into previous version if word count change < 10%
- Always creates new version if new block type added (widget, list, etc.)
- Each version stores: id, parentId, branchName, content, message, timestamp, wordCount

**Version Storage:**
```
/data/versions/
  /{documentId}/
    /versions.json    # Version tree (all versions)
```

**Read-Only Preview:**
- When viewing old versions, editor enters read-only mode
- Prevents accidental editing of historical content
- Restore functionality saves current state as new version before loading selected content
- Visual indication shows when in read-only preview mode

**Git-like Branching:**
- Click any version to preview it in read-only mode
- Edit while in preview mode to create a new branch
- Branch versions shown in separate "Branches" section with orange styling
- Main line commits use grey nodes, HEAD uses glowing orange node
- Selected version highlighted with orange border
- Git-style 7-character commit hashes displayed
- Rail line connects commits (orange when selected, grey otherwise)

**UI Design:**
- Dark zinc-950 background with subtle borders
- Orange accent (#FF4F11) for HEAD, selected, and branch elements
- GitCommit icon in header with commit count
- Footer panel shows selected commit details with restore button
- Branch pills with GitBranch icons

**Future:**
- Tree visualization with connected lines from branches
- Click any node to view/restore that version

---

## Data Model

### Documents (JSON)
```
{
  "id": "uuid",
  "title": "My Document",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp",
  "currentVersionId": "uuid"
}
```

### Versions / Timeline (JSON)
```
{
  "id": "uuid",
  "documentId": "uuid",
  "parentId": "uuid | null",
  "content": "Lexical JSON",
  "message": "Optional commit message",
  "createdAt": "ISO timestamp",
  "wordCount": number
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
│   │   ├── FloatingToolbar.tsx # Notion-style bubble toolbar
│   │   ├── SlashCommandMenuPlugin.tsx # / command menu
│   │   ├── DraggableBlockPlugin.tsx   # Drag handles + button
│   │   ├── KeyboardShortcutsPlugin.tsx # Ctrl+B/I/U shortcuts
│   │   └── editor.test.tsx    # Editor tests
│   ├── layout/
│   │   └── Layout.tsx         # Main layout wrapper
│   └── ThemeToggle.tsx        # Dark/light toggle
├── lib/
│   ├── storage.ts             # JSON file operations
│   ├── versions.ts            # Version history logic
│   ├── ai-scope.ts            # AI allowed imports (future)
│   └── ai.ts                 # AI SDK setup (future)
├── stores/
│   └── documentStore.ts       # Document state (Zustand)
├── hooks/
│   └── useTheme.ts           # Theme toggle hook
├── test/
│   └── setup.ts              # Vitest setup
├── App.tsx                   # Main app with sidebar
└── main.tsx                  # React entry point
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
