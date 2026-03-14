import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getAppPath: (): Promise<string> => ipcRenderer.invoke('get-app-path'),
  getVersion: (): Promise<string> => ipcRenderer.invoke('get-version'),
  onMenuAction: (callback: (action: string) => void): void => {
    ipcRenderer.on('menu-action', (_event: Electron.IpcRendererEvent, action: string) => callback(action));
  },
});