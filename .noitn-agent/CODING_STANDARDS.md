# Noitn - Coding Standards

## TypeScript
- Use strict TypeScript mode
- Avoid `any` - use `unknown` if type is truly unknown
- Prefer interfaces over types for object shapes

## React
- Use functional components with hooks
- Avoid default exports for better refactoring
- Colocate related files (component + styles + tests)

## Electron

### Security (https://www.electronjs.org/docs/latest/tutorial/security)
- **Always** use `contextIsolation: true` and `nodeIntegration: false`
- Use preload scripts with `contextBridge.exposeInMainWorld` for IPC
- Never expose full `require` or `ipcRenderer` to renderer
- Validate all IPC inputs in main process

### Main Process (https://www.electronjs.org/docs/latest/tutorial/quick-start#main-process)
- Keep main process thin - business logic in renderer
- Use `app.whenReady()` for async initialization
- Handle `window-all-closed` and `activate` events properly
- Use `BrowserWindow.getAllWindows()` to check for existing windows

### IPC (https://www.electronjs.org/docs/latest/tutorial/ipc)
- Prefer async `ipcMain.handle()` / `ipcRenderer.invoke()` over send/on
- Use descriptive channel names: `'storage:read-document'`, not `'read'`
- Define IPC types in shared file for type safety
- Example: `ipcMain.handle('storage:read-document', async (_event, id: string) => {...})`

### BrowserWindow (https://www.electronjs.org/docs/latest/api/browser-window)
- Set `show: false` and use `ready-to-show` event to prevent flash
- Configure webPreferences with preload path, contextIsolation, sandbox
- Use `webContents.openDevTools()` only in development

### Preload Scripts (https://www.electronjs.org/docs/latest/tutorial/preload)
- Expose limited API via `contextBridge.exposeInMainWorld`
- Never use `require('electron')` in preload - it's already available
- Example:
  ```typescript
  contextBridge.exposeInMainWorld('electronAPI', {
    getAppPath: () => ipcRenderer.invoke('get-app-path'),
    // ...
  })
  ```

### Packaging (https://www.electronjs.org/docs/latest/tutorial/quick-start#package-and-distribute)
- Use electron-builder for packaging
- Configure `build` in package.json with files, directories, platform targets
- Test on actual platforms - dev mode !== production

## shadcn/ui
- All UI components must use shadcn/ui primitives from `@/components/ui`
- Components are generated via `npx shadcn@latest add <component>`
- Available components: Button, Card, Input, Table, Tabs, Accordion, Dialog, Drawer, DropdownMenu, Select, Switch, Slider, ScrollArea, Tooltip, Separator
- Use Tailwind CSS for all styling with Sunset Noir theme colors
- Theme colors: `bg-zinc-950`, `text-zinc-50`, `text-[#FF4F11]` (accent)

## Lexical
- Define node schemas in `/src/components/editor/nodes`
- Use DecoratorNode for widgets
- Use `useLexicalEditor` hook for editor state

## Storage
- JSON files in app data folder
- Use UUIDs for all IDs (not auto-increment)
- Debounce saves (500ms)

## AI Widget Generation
- AI generates widgets using shadcn components only
- Create `/src/lib/ai-scope.ts` to export all allowed components
- AI scope must include: React hooks, lucide-react icons, shadcn components, backend IPC wrapper
- System prompt must restrict AI to only allowed imports

## General
- Small commits, focused changes
- No commented-out code
- Delete console logs before merge