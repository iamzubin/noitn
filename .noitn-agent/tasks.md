# Noitn - Task List

## Tech Stack (Final)
- **Desktop:** Electron
- **Frontend:** React + TypeScript + Vite
- **Editor:** Lexical
- **UI:** shadcn/ui components
- **Storage:** JSON files in app data folder
- **AI:** Vercel AI SDK (BYOK or Ollama)
- **Theme:** Sunset Noir (light/dark)

---

## Phase 1: Environment Setup (Week 1)

### Session 1 (20 min) - Electron + React Setup
- [x] Initialize Electron + React + TypeScript + Vite project
- [x] Verify dev server runs successfully
- [x] Build production .exe/.app to confirm setup

### Session 2 (20 min) - shadcn/ui + Dependencies
- [ ] Install shadcn/ui: `npx shadcn@latest init`
- [ ] Add shadcn components: button, card, input, table, tabs, accordion, dialog, drawer, dropdown-menu, select, switch, slider, separator, scroll-area, tooltip
- [ ] Install Lexical: `@lexical/react`, `@lexical/rich-text`, `@lexical/list`, `@lexical/code`, `@lexical/link`
- [ ] Install AI SDK: `ai`, `zod`, `@ai-sdk/openai`, `@ai-sdk/google`
- [ ] Install lucide-react icons

### Session 3 (20 min) - Theme + App Structure
- [ ] Configure tailwind.config.js with Sunset Noir colors
- [ ] Create app folder structure: `/src/components`, `/src/lib`, `/src/hooks`, `/src/stores`
- [ ] Create Layout component with sidebar + main content area
- [ ] Implement dark/light theme toggle

### Session 4 (20 min) - JSON Storage
- [ ] Create JSON file storage utility in `/src/lib/storage.ts`
- [ ] Implement `loadDocuments()`, `saveDocument()`, `loadBlocks()`, `saveBlocks()`
- [ ] Set up data folder in app data directory
- [ ] Create sample document on first launch

---

## Phase 2: Lexical Editor (Week 2)

### Session 5 (15 min) - Basic Editor
- [ ] Create `Editor.tsx` with Lexical `LexicalComposer`
- [ ] Add RichTextPlugin, ContentEditable, HistoryPlugin
- [ ] Test basic typing and headings

### Session 6 (15 min) - Editor Toolbar
- [ ] Create toolbar component with formatting buttons (bold, italic, headings)
- [ ] Add shadcn Button components to toolbar
- [ ] Style editor with Sunset Noir theme

### Session 7 (15 min) - Block Types
- [ ] Add paragraph, heading nodes
- [ ] Implement slash command menu for inserting blocks
- [ ] Add heading levels (H1, H2, H3)

### Session 8 (15 min) - Save/Load
- [ ] Serialize Lexical state to JSON on change (debounced)
- [ ] Load document on startup
- [ ] Test document persistence

---

## Phase 3: Sidebar + Navigation (Week 2)

### Session 9 (15 min) - Sidebar
- [ ] Create Sidebar component with document list
- [ ] Add shadcn Card for document items
- [ ] Implement "New Document" button

### Session 10 (15 min) - Document Switching
- [ ] Create document store (Zustand or React Context)
- [ ] Implement switch document functionality
- [ ] Auto-save on document switch

---

## Phase 4: AI Widget System (Week 3)

### Session 11 (20 min) - Widget Node
- [ ] Define `WidgetNode` in Lexical
- [ ] Create WidgetDecorator component
- [ ] Add widget attributes: type, schema, state

### Session 12 (20 min) - Widget Registry
- [ ] Create `/src/components/widgets/` folder
- [ ] Create widget registry mapping type → component
- [ ] Add basic widget types: Kanban, Table, Card

### Session 13 (20 min) - Insert Widget UI
- [ ] Add "Insert Widget" to slash command menu
- [ ] Create widget picker dialog with preview
- [ ] Insert WidgetNode at cursor

### Session 14 (20 min) - Widget Interaction
- [ ] Make widgets editable (click to edit)
- [ ] Save widget state to block content
- [ ] Test widget persistence

### Session 14b (20 min) - Widget Designer
- [ ] Add Drawer component: `npx shadcn@latest add drawer`
- [ ] Create WidgetDesigner.tsx component
- [ ] Add right-click context menu on widgets with "Edit Widget" option
- [ ] Open Drawer with:
  - Widget type dropdown
  - Dynamic form fields based on widget type
  - Live preview
- [ ] Save changes back to widget state

---

## Phase 5: AI Integration (Week 4)

### Session 15 (20 min) - AI SDK Setup
- [ ] Create `/src/lib/ai-scope.ts` exporting shadcn components
- [ ] Create backend IPC wrapper for AI calls
- [ ] Implement provider selection (OpenAI/Gemini/Ollama)

### Session 16 (20 min) - AI Widget Generation
- [ ] Create AI prompt template for widget generation
- [ ] Implement `generateWidget()` function using AI SDK
- [ ] Parse AI response and create widget node

### Session 17 (20 min) - Context-Aware AI
- [ ] Extract text around cursor (1000 chars)
- [ ] Include context in AI prompt
- [ ] Test AI generating relevant widgets

### Session 18 (15 min) - AI UI Polish
- [ ] Add "AI Generate" button to slash menu
- [ ] Show loading state during generation
- [ ] Handle AI errors gracefully

---

## Phase 6: Polish (Week 5)

### Session 19 (20 min) - Final Testing
- [ ] Test: create document, add text, switch docs
- [ ] Test: insert widget, edit widget, save
- [ ] Test: AI generate widget with context
- [ ] Test: restart app, verify all data persists

### Session 20 (20 min) - Polish
- [ ] Add keyboard shortcuts
- [ ] Polish UI styling
- [ ] Write README with setup instructions

---

## Future Enhancements (Post-MVP)
- [ ] More widget types (Charts, Forms, Calendars)
- [ ] Image/file uploads
- [ ] Document search
- [ ] Export to Markdown/HTML
- [ ] Multiple workspaces
