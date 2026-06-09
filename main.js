const { app, BrowserWindow, screen, ipcMain, Tray, Menu, nativeImage } = require('electron');
const path = require('path');

let catWindow;
let stretchInterval;
let STRETCH_INTERVAL_MS = 30 * 60 * 1000;

let GlobalKeyboardListener;
let keyListener;
try {
  GlobalKeyboardListener = require('node-global-key-listener').GlobalKeyboardListener;
} catch (e) {
  console.log('Global keyboard listener not available, using fallback');
}

function createCatWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  catWindow = new BrowserWindow({
    width: 120,
    height: 120,
    x: Math.floor(width / 2),
    y: Math.floor(height - 150),
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    focusable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  catWindow.loadFile('src/index.html');
  catWindow.setIgnoreMouseEvents(true, { forward: true });

  let currentX = Math.floor(width / 2);
  let currentY = Math.floor(height - 150);
  let isMoving = false;

  setInterval(() => {
    try {
      const point = screen.getCursorScreenPoint();

      // Validate point values before using them
      if (!point || typeof point.x !== 'number' || typeof point.y !== 'number') return;
      if (!isFinite(point.x) || !isFinite(point.y)) return;

      const newTargetX = point.x - 60;
      const newTargetY = point.y - 80;

      const dx = newTargetX - currentX;
      const dy = newTargetY - currentY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (!isFinite(dist)) return;

      if (dist > 5) {
        currentX += dx * 0.08;
        currentY += dy * 0.08;

        // Clamp: must be integers, >= 0, within screen
        const safeX = Math.max(0, Math.min(width - 120,  Math.round(currentX)));
        const safeY = Math.max(0, Math.min(height - 120, Math.round(currentY)));

        if (isFinite(safeX) && isFinite(safeY)) {
          catWindow.setPosition(safeX, safeY);
        }

        if (!isMoving) {
          isMoving = true;
          catWindow.webContents.send('cat-state', 'walking');
        }
      } else {
        if (isMoving) {
          isMoving = false;
          catWindow.webContents.send('cat-state', 'idle');
        }
      }
    } catch (err) {
      // swallow any position errors so app doesn't crash
    }
  }, 16);

  if (GlobalKeyboardListener) {
    try {
      keyListener = new GlobalKeyboardListener();
      let typingTimeout;
      let isTyping = false;
      let keyCount = 0;

      keyListener.addListener((e) => {
        if (e.state === 'DOWN') {
          keyCount++;
          clearTimeout(typingTimeout);
          if (!isTyping) {
            isTyping = true;
            catWindow.webContents.send('cat-state', 'typing');
          }
          if (keyCount > 15) {
            catWindow.webContents.send('cat-state', 'overheat');
          }
          typingTimeout = setTimeout(() => {
            isTyping = false;
            keyCount = 0;
            catWindow.webContents.send('cat-state', 'idle');
          }, 1500);
        }
      });
    } catch (e) {
      console.log('Could not start key listener:', e.message);
    }
  }

  stretchInterval = setInterval(() => {
    catWindow.webContents.send('cat-state', 'stretch');
    setTimeout(() => {
      catWindow.webContents.send('cat-state', 'idle');
    }, 8000);
  }, STRETCH_INTERVAL_MS);
}

app.whenReady().then(() => {
  createCatWindow();
});

app.on('window-all-closed', () => {
  if (keyListener) keyListener.kill();
  app.quit();
});