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

### Session 7 - Block Types (COMPLETE)
- [x] Slash command menu for inserting blocks (type "/" for H1, H2, H3, list, quote, code)
- [x] Floating + button for inserting blocks (Lexical playground-style on hover)
- [x] Drag handles for reordering blocks (DraggableBlockPlugin_EXPERIMENTAL)
- [x] UI for lists, code blocks, quotes via toolbar buttons
- [x] Double-click to rename document

### Session 8-9 - Widget System (COMPLETE)
- [x] Define WidgetNode in Lexical (extends DecoratorNode)
- [x] Create widget registry (timer, checkbox, counter, table, placeholder)
- [x] Insert widgets via slash command menu (type "/" then select widget)
- [x] Widget interaction (timer start/stop, checkbox toggle, counter increment)
- [x] Widget Designer with Drawer for editing properties
- [x] Geist fonts packaged in public/files/geist-sans/

### Session 10 - Timeline / Version History (NEEDS IMPROVEMENT)
- [x] Git-like tree-based version history per document
- [x] Auto-save creates version snapshots (with 10% change threshold)
- [x] New block type added = new version (not merged)
- [x] Version on tab switch
- [x] View history panel with timeline tree
- [x] Restore to previous version with read-only preview mode
- [x] Collapsible sidebar with theme toggle
- [x] Tests for version history
- [x] Simplified version history UI (Google Docs style)
- [x] Prominent restore button with visual feedback when version selected
- [x] Read-only mode when previewing old versions (no editing allowed)
- [x] Automatic branch creation when editing old versions (git-like behavior)

### Session 11-14 - AI Integration (BROKEN DOWN)
#### Session 11: AI SDK Setup
- [ ] AI SDK provider configuration (OpenAI/Anthropic/Groq)
- [ ] API key input/storage in settings
- [ ] Basic text generation test
- [ ] Error handling for API failures

#### Session 12: Context-Aware AI Features
- [ ] AI-powered widget generation from natural language
- [ ] Context-aware prompts based on document content
- [ ] Smart suggestions for formatting and structure
- [ ] AI-assisted content completion

#### Session 13: AI Loading States & UX
- [ ] Loading spinners/skeletons for AI operations
- [ ] Progressive disclosure of AI results
- [ ] Cancel/in-progress state indicators
- [ ] Error states with retry mechanisms

#### Session 14: AI Polish & Integration
- [ ] AI toolbar button with dropdown menu
- [ ] Keyboard shortcuts for AI commands
- [ ] History of AI-generated content
- [ ] Feedback mechanism for AI quality

### Session 15-16 - Polish
- [ ] Keyboard shortcuts
- [ ] Final testing
- [ ] README

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
