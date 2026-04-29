const { app, BrowserWindow, screen, session } = require('electron');
const path = require('path');
const fs = require('fs');

// ─── Persistent window state ─────────────────────────────────────────────────
const STATE_FILE = path.join(app.getPath('userData'), 'window-state.json');

function loadWindowState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); }
  catch { return null; }
}

function saveWindowState(win) {
  if (!win || win.isDestroyed()) return;
  fs.writeFileSync(STATE_FILE, JSON.stringify({
    bounds: win.getBounds(),
    maximized: win.isMaximized()
  }), 'utf8');
}

// ─── Window creation ─────────────────────────────────────────────────────────
function createWindow() {
  const saved = loadWindowState();
  const { width: screenW, height: screenH } = screen.getPrimaryDisplay().workAreaSize;

  const defaults = {
    width: Math.round(screenW * 0.85),
    height: Math.round(screenH * 0.9),
    x: Math.round(screenW * 0.075),
    y: Math.round(screenH * 0.05),
  };

  const bounds = saved?.bounds || defaults;

  if (saved?.bounds) {
    const displays = screen.getAllDisplays();
    const onScreen = displays.some(d => {
      const db = d.bounds;
      return bounds.x >= db.x - 100 && bounds.y >= db.y - 100 &&
             bounds.x < db.x + db.width && bounds.y < db.y + db.height;
    });
    if (!onScreen) Object.assign(bounds, defaults);
  }

  const win = new BrowserWindow({
    ...bounds,
    minWidth: 680,
    minHeight: 500,
    title: 'Jane',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 12, y: 10 },
    backgroundColor: '#1a1a2e',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
    icon: path.join(__dirname, 'icon.png'),
  });

  if (saved?.maximized) win.maximize();

  win.once('ready-to-show', () => {
    win.show();
    win.focus();
  });

  // Save window state
  let saveTimeout;
  const debouncedSave = () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => saveWindowState(win), 500);
  };
  win.on('resize', debouncedSave);
  win.on('move', debouncedSave);
  win.on('close', () => saveWindowState(win));

  // External links open in default browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith('https://agent-s.app')) {
      require('electron').shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  // Clean user agent
  const ua = win.webContents.getUserAgent();
  win.webContents.setUserAgent(ua.replace(/Electron\/\S+\s/, ''));

  win.loadURL('https://agent-s.app/');
}

// ─── App lifecycle ───────────────────────────────────────────────────────────
app.whenReady().then(() => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'content-security-policy': undefined,
      },
    });
  });
  createWindow();
});

app.on('window-all-closed', () => app.quit());
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
