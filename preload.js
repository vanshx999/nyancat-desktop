const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.on('cat-state', (event, state) => {
    window.dispatchEvent(new CustomEvent('cat-state', { detail: state }));
  });
});