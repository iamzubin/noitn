import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getAppPath: (): Promise<string> => ipcRenderer.invoke('get-app-path'),
  getVersion: (): Promise<string> => ipcRenderer.invoke('get-version'),
  onMenuAction: (callback: (action: string) => void): void => {
    ipcRenderer.on('menu-action', (_event: Electron.IpcRendererEvent, action: string) => callback(action));
  },
  ensureDir: (dirPath: string): Promise<boolean> => ipcRenderer.invoke('ensure-dir', dirPath),
  readDir: (dirPath: string): Promise<string[]> => ipcRenderer.invoke('read-dir', dirPath),
  readFile: (filePath: string): Promise<string | null> => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath: string, content: string): Promise<boolean> => ipcRenderer.invoke('write-file', filePath, content),
  deleteFile: (filePath: string): Promise<boolean> => ipcRenderer.invoke('delete-file', filePath),
  minimizeWindow: (): void => ipcRenderer.send('window-minimize'),
  maximizeWindow: (): void => ipcRenderer.send('window-maximize'),
  closeWindow: (): void => ipcRenderer.send('window-close'),
});
