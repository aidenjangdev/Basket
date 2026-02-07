const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openWizard: () => ipcRenderer.invoke('open-wizard')
});
contextBridge.exposeInMainWorld('wizardAPI', {
  close: () => ipcRenderer.send('close-wizard'),
  getSpigotVersions: () => ipcRenderer.invoke('get-spigot-versions'),
  createServer: (payload) => ipcRenderer.invoke('create-server', payload)
});