/// <reference types="vite/client" />

interface Window {
  electronAPI: {
    getAppPath: () => Promise<string>
    getVersion: () => Promise<string>
    onMenuAction: (callback: (action: string) => void) => void
  }
}