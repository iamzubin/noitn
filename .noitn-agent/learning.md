# Noitn - Learnings

Session learnings, pitfalls, and decisions go here.

---

## Session 1: Electron + React + TypeScript Setup

**Date:** 2026-03-14
**What worked:**
- Using esbuild to compile main.ts/preload.ts for Electron (faster than ts-node)
- Strict TypeScript with separate tsconfig.electron.json
- electron-builder with `--mac --dir` for quick dev builds

**What didn't:**
- Had old index.html with demo content - replaced with React entry point
- Initially used CommonJS require in main.ts, switched to ES imports

**Decision:**
- Use esbuild for Electron compilation, not ts-node (simpler)
- Keep Electron files in root, React in /src
- Build order: `npm run build` (Vite) → `npm run build:electron` (esbuild) → electron-builder

---

## Session 2-3: shadcn/ui + Theme + Layout

**What worked:**
- shadcn/ui with `npx shadcn@latest init` and component additions
- Theme toggle using useTheme hook with CSS variables
- Layout with fixed titlebar, sidebar, main content

**What didn't:**
- Had to configure Tailwind CSS output properly
- Layout positioning needed fixed positioning for titlebar

**Decision:**
- Use shadcn Button, Card, ScrollArea components
- Titlebar uses WebkitAppRegion for drag support

---

## Session 4: JSON Storage

**What worked:**
- IPC pattern for file operations (readFile, writeFile, etc.)
- Separate folders for documents (metadata) and blocks (content)
- ensureSampleDocument creates welcome doc on first launch

**What didn't:**
- Preload had missing API methods initially - had to add all needed functions

**Decision:**
- Storage API: getAppPath, ensureDir, readDir, readFile, writeFile, deleteFile

---

## Session 5: Lexical Editor

**What worked:**
- LexicalComposer with basic plugins
- HeadingNode for headings
- Debounced save with setTimeout + clearTimeout

**What didn't:**
- LoadContentPlugin needed careful handling to not re-load on same doc
- Had to use createEditor().parseEditorState() for proper deserialization

**Decision:**
- Save debounce: 1 second delay
- Reset loadedRef when documentId changes
- Auto-save on document switch

---

## Session 6-10: Sidebar + Document Switching

**What worked:**
- Zustand store for document state
- Sidebar in Layout with document list
- New Document creates both doc file and blocks file

**What didn't:**
- Each document needs its own blocks file - added in createDocument()
- Initial load needed to handle empty state

**Decision:**
- Each doc gets empty paragraph on creation
- Auto-save before switching documents

---

## Session 6: Editor Toolbar (Floating)

**What worked:**
- FloatingToolbar using @floating-ui/react for positioning
- Shows on text selection, hides when collapsed
- Uses `getBoundingClientRect()` on window.getSelection() for positioning
- Bubble-style with dark zinc theme matching Notion

**What didn't:**
- Lexical doesn't have built-in floating toolbar plugin
- Had to use selectionchange event + Lexical's SELECTION_CHANGE_COMMAND
- Toolbar positioning needs manual calculation above selection

**Decision:**
- Use floating bubble menu (Notion-style) instead of fixed toolbar
- Dark theme: bg-zinc-900/95 with backdrop blur
- Buttons: white icons, hover shows white/10 bg

**Available Block Types:**
- @lexical/table - Tables
- @lexical/list - Lists (ordered/unordered)
- @lexical/code - Code blocks
- @lexical/rich-text - Headings, Quotes
- @lexical/link - Links

See `.noitn-agent/design.md` for full list.

---

## How to Use

After each session, document:
1. What you learned
2. What to avoid
3. Architecture decisions made