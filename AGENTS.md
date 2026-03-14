# Noitn - Agent Instructions

## Tech Stack
- [Electron](https://www.electronjs.org/docs/latest/) (desktop)
- React + TypeScript + Vite
- [Lexical](https://lexical.dev/) (editor)
- shadcn/ui (components)
- Vercel AI SDK
- JSON file storage

## Available Tools

Use the available tools for code search and exploration:
- **Grep**: Fast content search across the codebase
- **Glob**: Find files by patterns (e.g., `src/**/*.tsx`)
- **Read**: Read files directly
- **Task**: Use explore agent for open-ended searches
- **webfetch/codesearch/websearch**: For external documentation

**Before writing code**: Use search tools to understand existing patterns, imports, and conventions.

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
2. Create and work on changes (user runs `npm run dev` themselves - do NOT run npm commands)
3. Complete task from tasks.md
4. **Update docs** - Add learnings to `.noitn-agent/learning.md`, update `.noitn-agent/codemap.md` if architecture changed
5. Ask user: "Should I mark the task as complete in `.noitn-agent/tasks.md`?" (mention they can see the change with `git diff .noitn-agent/tasks.md`)
6. If yes, update tasks.md with the completed session
7. Ask user to run `git add . && git commit -m "Session N: <description>"`
8. Ask user to run `git checkout main && git merge session-N --no-ff`
9. Ask user to remove worktree: `git worktree remove .noitn-agent/sessions/session-N`

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

### React Best Practices
- Use Vercel React best practices for performance (see loaded skill)
- Use `use client` for client-side components
- Use React Server Components where possible
- Memoize expensive calculations with `useMemo`
- Memoize callbacks with `useCallback`
- Use `useState` for local state, `useReducer` for complex state
- Avoid inline component definitions
- Use ternary for conditionals, not `&&`
- Extract static JSX outside render function
- Use proper key props in lists
- Avoid unnecessary re-renders

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

## Testing

Before writing code:
1. Write failing tests for the new feature/fix
2. Run tests to verify they fail
3. Write code to make tests pass
4. Run tests to verify they pass
5. Run typecheck and build to ensure no regressions

Run tests with: `npm test` or `vitest`

## TDD Workflow

For each session:
1. Check current branch: `git branch --show-current`
2. Review tasks.md for current session goals
3. For each task:
   a. Write test(s) first
   b. Run tests - expect failure
   c. Implement feature
   d. Run tests - expect pass
   e. Run typecheck: `npx tsc --noEmit`
   f. Run build: `npm run build`
4. Commit with passing tests
5. Update learning.md with what worked/didn't