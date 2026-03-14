# Noitn - Agent Instructions

## Tech Stack
- [Electron](https://www.electronjs.org/docs/latest/) (desktop)
- React + TypeScript + Vite
- [Lexical](https://lexical.dev/) (editor)
- shadcn/ui (components)
- Vercel AI SDK
- JSON file storage

## Electron Docs Reference

When working with Electron, reference these docs:

| Feature | Docs Link |
|---------|-----------|
| Quick Start | https://www.electronjs.org/docs/latest/tutorial/quick-start |
| Security | https://www.electronjs.org/docs/latest/tutorial/security |
| Main Process | https://www.electronjs.org/docs/latest/tutorial/quick-start#main-process |
| IPC | https://www.electronjs.org/docs/latest/tutorial/ipc |
| BrowserWindow | https://www.electronjs.org/docs/latest/api/browser-window |
| Preload Scripts | https://www.electronjs.org/docs/latest/tutorial/preload |
| Menu | https://www.electronjs.org/docs/latest/api/menu |
| Tray | https://www.electronjs.org/docs/latest/api/tray |
| Dialog | https://www.electronjs.org/docs/latest/api/dialog |
| Packaging | https://www.electronjs.org/docs/latest/tutorial/quick-start#package-and-distribute |
| Auto Updater | https://www.electronjs.org/docs/latest/api/auto-updater |

## Session Workflow

Each session (15-20 mins):

1. `git branch --show-current`
2. `git worktree add ../noitn-sessions/session-N main`
3. Complete task from tasks.md
4. **Update docs** - Add learnings to `.noitn-agent/learning.md`, update `.noitn-agent/codemap.md` if architecture changed
5. Ask user: "Should I mark the task as complete in `.noitn-agent/tasks.md`?"
6. If yes, update tasks.md with the completed session
7. `git add . && git commit -m "Session N: <description>"`
8. `git checkout main && git merge session-N --no-ff`
9. `git worktree remove ../noitn-sessions/session-N`

## Always Update Docs

After each session, update:

1. **`.noitn-agent/learning.md`** - Document:
   - What worked
   - What didn't work
   - Decisions made

2. **`.noitn-agent/codemap.md`** - If you:
   - Added new files/services → add to architecture
   - Created new patterns → document them
   - Changed dependency flow → update diagram

3. **`.noitn-agent/structure.md`** - If you created new files/folders

When refactoring: check if changes break other parts, update docs to reflect new structure.

## Coding Standards

### Dependency Injection
- Pass dependencies as params, not imports inside functions
- Use context/providers for shared services (storage, AI, theme)
- Example: `function Component({ storage }: { storage: StorageService })`

### Minimal Code
- One responsibility per function (atomic)
- Max ~50 lines per function
- Max ~200 lines per file
- Extract repeated patterns into utilities

### Comments
- Quick docstring for functions: `// Does X, returns Y`
- Explain *why*, not *what*
- Skip obvious comments

### Structure
- Colocate: component + tests + styles nearby
- Feature folders: `/features/widget-designer/` not `/components/` + `/hooks/` + `/utils/`

### shadcn
- Use shadcn primitives for all UI
- Run: `npx shadcn@latest add <component>`
- Export all components in `/src/lib/ai-scope.ts` for AI access

## Files to Maintain

- `SPEC.md` - Project spec
- `CODING_STANDARDS.md` - Coding rules
- `.noitn-agent/tasks.md` - Task list
- `.noitn-agent/learning.md` - Session learnings (update after each session)
- `.noitn-agent/codemap.md` - Architecture reference (update when structure changes)
- `.noitn-agent/structure.md` - Project structure (update when files change)
- `.noitn-agent/design.md` - Design specs

**Refer to `.noitn-agent/*.md` files when you need context on architecture, design, or past decisions.**

## Gitignore

Ignore `.noitn-agent/` folder.