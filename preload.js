const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping')
  // test: () => ipcRenderer.invoke('test')
  // Nous pouvons exposer des variables en plus des fonctions
});

contextBridge.exposeInMainWorld('db', {
  ipcRenderer: {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) => ipcRenderer.on(channel, func),
    once: (channel, func) => ipcRenderer.once(channel, func)
  }
});
contextBridge.exposeInMainWorld('system', {
  restart: () => ipcRenderer.send('restart'),
  end: () => ipcRenderer.send('end')
});
contextBridge.exposeInMainWorld('path', {
  fileExists: () => ipcRenderer.invoke('fileExists'),
  readFile: () => ipcRenderer.invoke('readFile'),
  fileSettingsExists: () => ipcRenderer.invoke('fileSettingsExists'),
  readFileSettings: () => ipcRenderer.invoke('readFileSettings'),
  writeFileSettings: (fileData) => ipcRenderer.send('writeFileSettings', fileData)
});