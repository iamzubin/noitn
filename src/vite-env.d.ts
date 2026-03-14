/// <reference types="vite/client" />

interface Window {
  electronAPI: {
    getAppPath: () => Promise<string>
    getVersion: () => Promise<string>
    onMenuAction: (callback: (action: string) => void) => void
    ensureDir: (path: string) => Promise<boolean>
    readDir: (path: string) => Promise<string[]>
    readFile: (path: string) => Promise<string | null>
    writeFile: (path: string, content: string) => Promise<boolean>
    deleteFile: (path: string) => Promise<boolean>
    minimizeWindow: () => void
    maximizeWindow: () => void
    closeWindow: () => void
  }
}