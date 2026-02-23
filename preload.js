const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    selectDirectory: () => ipcRenderer.invoke('select-directory'),
    saveFile: (directory, filename, content) => ipcRenderer.invoke('save-file', { directory, filename, content }),
    deleteItems: (directory, mode, venvName) => ipcRenderer.invoke('delete-items', { directory, mode, venvName }),
    openTerminal: (directory) => ipcRenderer.invoke('run-external-terminal', { directory }),
    runResetTerminal: (directory) => ipcRenderer.invoke('run-reset-terminal', { directory }),
    readDirectoryRecursive: (directory) => ipcRenderer.invoke('read-directory-recursive', { directory }),
    showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
    archiveWorkspace: (sourceDir, destPath) => ipcRenderer.invoke('archive-workspace', { sourceDir, destPath }),
    minimize: () => ipcRenderer.invoke('window-minimize'),
    maximize: () => ipcRenderer.invoke('window-maximize'),
    close: () => ipcRenderer.invoke('window-close')
});
