"use strict";

// preload.ts
var import_electron = require("electron");
import_electron.contextBridge.exposeInMainWorld("electronAPI", {
  getAppPath: () => import_electron.ipcRenderer.invoke("get-app-path"),
  getVersion: () => import_electron.ipcRenderer.invoke("get-version"),
  onMenuAction: (callback) => {
    import_electron.ipcRenderer.on("menu-action", (_event, action) => callback(action));
  },
  ensureDir: (dirPath) => import_electron.ipcRenderer.invoke("ensure-dir", dirPath),
  readDir: (dirPath) => import_electron.ipcRenderer.invoke("read-dir", dirPath),
  readFile: (filePath) => import_electron.ipcRenderer.invoke("read-file", filePath),
  writeFile: (filePath, content) => import_electron.ipcRenderer.invoke("write-file", filePath, content),
  deleteFile: (filePath) => import_electron.ipcRenderer.invoke("delete-file", filePath),
  minimizeWindow: () => import_electron.ipcRenderer.send("window-minimize"),
  maximizeWindow: () => import_electron.ipcRenderer.send("window-maximize"),
  closeWindow: () => import_electron.ipcRenderer.send("window-close")
});
