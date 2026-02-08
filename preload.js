const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openWizard: () => ipcRenderer.invoke('open-wizard'),
  serveredit: () => ipcRenderer.invoke('serveredit')
});
contextBridge.exposeInMainWorld('editAPI', {
  close: () => ipcRenderer.send('close-edit'),
  editServer: (payload) => ipcRenderer.invoke('edit-server', payload)
});
contextBridge.exposeInMainWorld('wizardAPI', {
  close: () => ipcRenderer.send('close-wizard'),
  createServer: (payload) => ipcRenderer.invoke('create-server', payload)
});