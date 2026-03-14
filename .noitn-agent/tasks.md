# Noitn - Task List

## Tech Stack
- **Desktop:** Electron
- **Frontend:** React + TypeScript + Vite
- **Editor:** Lexical
- **UI:** shadcn/ui components
- **Storage:** JSON files in app data folder
- **AI:** Vercel AI SDK (BYOK or Ollama)
- **Theme:** Sunset Noir (light/dark)

---

## Completed

### Phase 1: Setup
- [x] Electron + React + Vite project
- [x] shadcn/ui + all components installed
- [x] Lexical editor packages
- [x] Zustand state management
- [x] Theme toggle (dark/light)
- [x] Layout with sidebar + content

### Phase 2: Storage + Editor
- [x] JSON file storage (`storage.ts`)
- [x] Document CRUD operations
- [x] Lexical Editor with basic typing
- [x] Auto-save (debounced 1s)
- [x] Save on document switch
- [x] Each document has own content

### Phase 3: Navigation
- [x] Sidebar with document list
- [x] New Document button
- [x] Document switching
- [x] Delete document

---

## Next Sessions

### Session 6 - Editor Toolbar (COMPLETE)
- [x] Add formatting buttons (bold, italic, underline)
- [x] Heading level selector (H1, H2, H3)
- [x] Use shadcn Button components
- [x] Style to match Sunset Noir theme
- [x] Floating toolbar (Notion-style) with @floating-ui/react
- [x] Keyboard shortcuts (Ctrl+B/I/U, Ctrl+1/2/3)
- [x] Install block type packages (table, quote, list, code)

### Session 7 - Block Types (NEXT)
- [ ] Slash command menu for inserting blocks
- [ ] UI for lists, code blocks, quotes (toolbar buttons or menu)

### Session 8-10 - Widget System
- [ ] Define WidgetNode in Lexical
- [ ] Create widget registry
- [ ] Insert Widget UI
- [ ] Widget interaction/editing
- [ ] Widget Designer with Drawer

### Session 11-14 - AI Integration
- [ ] AI SDK setup
- [ ] Widget generation
- [ ] Context-aware prompts
- [ ] Loading states + error handling

### Session 15-16 - Polish
- [ ] Keyboard shortcuts
- [ ] Final testing
- [ ] README

---

## Future
- Export to Markdown/HTML
- Document search
- More widget types
- Image uploads
