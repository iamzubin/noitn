"use strict";

// preload.ts
var import_electron = require("electron");
import_electron.contextBridge.exposeInMainWorld("electronAPI", {
  getAppPath: () => import_electron.ipcRenderer.invoke("get-app-path"),
  getVersion: () => import_electron.ipcRenderer.invoke("get-version"),
  onMenuAction: (callback) => {
    import_electron.ipcRenderer.on("menu-action", (_event, action) => callback(action));
  }
});
