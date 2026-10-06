const { app, BrowserWindow, Menu, shell, session } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1100, height: 800, minWidth: 380, minHeight: 560,
    backgroundColor: '#070a1c',
    icon: path.join(__dirname, 'nova.ico'),
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, sandbox: true }
  });
  Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, 'index.html'));

  // links open in your normal browser, not inside Nova
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });

  // F11 = full screen
  win.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown' && input.key === 'F11') { win.setFullScreen(!win.isFullScreen()); event.preventDefault(); }
  });
}

app.whenReady().then(() => {
  // allow the camera, microphone and copy/paste that Nova uses
  session.defaultSession.setPermissionRequestHandler((wc, permission, callback) => {
    callback(['media', 'clipboard-read', 'clipboard-sanitized-write', 'fullscreen'].includes(permission));
  });
  createWindow();
});

app.on('window-all-closed', () => app.quit());
