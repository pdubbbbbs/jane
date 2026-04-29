const { app, BrowserWindow, session } = require('electron');
const path = require('path');

const JANE_CSS = `
:root {
  --jane-bg-deep: #0a0e14;
  --jane-bg: #0d1117;
  --jane-bg-surface: #151b23;
  --jane-bg-elevated: #1c2333;
  --jane-border: #1e2a3a;
  --jane-border-bright: #253347;
  --jane-text: #c9d1d9;
  --jane-text-dim: #7a8599;
  --jane-text-bright: #e6edf3;
  --jane-accent: #00d4ff;
  --jane-accent-dim: #0099bb;
  --jane-accent-glow: rgba(0, 212, 255, 0.15);
  --jane-green: #00ff9f;
  --jane-red: #ff4a6e;
  --jane-orange: #ffaa33;
  --jane-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;
}

html, body {
  background-color: var(--jane-bg-deep) !important;
  color: var(--jane-text) !important;
  -webkit-font-smoothing: antialiased !important;
}

*, *::before, *::after { border-color: var(--jane-border) !important; }

div, section, main, aside, nav, header, footer, article { background-color: transparent !important; }

body > div, body > div > div,
[class*="app"], [class*="App"], [class*="layout"], [class*="Layout"],
[class*="container"], [class*="Container"], [class*="wrapper"], [class*="Wrapper"],
[class*="main"], [class*="Main"], [class*="page"], [class*="Page"] {
  background-color: var(--jane-bg-deep) !important;
}

[class*="sidebar"], [class*="Sidebar"], [class*="nav"], [class*="Nav"],
[class*="panel"], [class*="Panel"], [class*="drawer"], [class*="Drawer"] {
  background-color: var(--jane-bg) !important;
}

[class*="chat"], [class*="Chat"], [class*="message"], [class*="Message"],
[class*="conversation"], [class*="Conversation"], [class*="thread"], [class*="Thread"] {
  background-color: var(--jane-bg-deep) !important;
  color: var(--jane-text) !important;
}

[class*="assistant"], [class*="Assistant"], [class*="bot"], [class*="Bot"],
[class*="response"], [class*="Response"], [class*="agent"] {
  background-color: var(--jane-bg-surface) !important;
  color: var(--jane-text-bright) !important;
  border: 1px solid var(--jane-border) !important;
  border-radius: 8px !important;
}

[class*="user-message"], [class*="UserMessage"], [class*="human"], [class*="Human"] {
  background-color: var(--jane-bg-elevated) !important;
  color: var(--jane-text-bright) !important;
  border: 1px solid var(--jane-accent-dim) !important;
  border-radius: 8px !important;
}

textarea, [class*="input"], [class*="Input"], [class*="composer"], [class*="Composer"],
[class*="editor"], [class*="Editor"], [role="textbox"] {
  background-color: var(--jane-bg-surface) !important;
  color: var(--jane-text-bright) !important;
  border: 1px solid var(--jane-border-bright) !important;
  border-radius: 8px !important;
  caret-color: var(--jane-accent) !important;
  transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
}

textarea:focus, [class*="input"]:focus, [role="textbox"]:focus {
  border-color: var(--jane-accent) !important;
  box-shadow: 0 0 0 2px var(--jane-accent-glow), 0 0 20px var(--jane-accent-glow) !important;
  outline: none !important;
}

button, [role="button"] {
  background-color: var(--jane-bg-elevated) !important;
  color: var(--jane-text) !important;
  border: 1px solid var(--jane-border-bright) !important;
  transition: all 0.15s ease !important;
}

button:hover, [role="button"]:hover {
  background-color: var(--jane-accent-dim) !important;
  color: var(--jane-bg-deep) !important;
}

button[type="submit"], [class*="primary"], [class*="send"], [class*="Send"] {
  background-color: var(--jane-accent-dim) !important;
  color: var(--jane-bg-deep) !important;
  border-color: var(--jane-accent) !important;
}

button[type="submit"]:hover, [class*="primary"]:hover, [class*="send"]:hover {
  background-color: var(--jane-accent) !important;
  box-shadow: 0 0 12px var(--jane-accent-glow) !important;
}

pre, code, [class*="code"], [class*="Code"] {
  background-color: var(--jane-bg) !important;
  color: var(--jane-green) !important;
  font-family: var(--jane-mono) !important;
  border: 1px solid var(--jane-border) !important;
  border-radius: 6px !important;
}

a, a:visited { color: var(--jane-accent) !important; text-decoration: none !important; }
a:hover { color: var(--jane-green) !important; }

h1, h2, h3, h4, h5, h6 { color: var(--jane-text-bright) !important; }
h1 { color: var(--jane-accent) !important; }

th { background-color: var(--jane-bg-elevated) !important; color: var(--jane-accent) !important; }
td, th { border: 1px solid var(--jane-border) !important; padding: 8px 12px !important; }
tr:nth-child(even) td { background-color: var(--jane-bg-surface) !important; }

::-webkit-scrollbar { width: 8px !important; height: 8px !important; }
::-webkit-scrollbar-track { background: var(--jane-bg-deep) !important; }
::-webkit-scrollbar-thumb { background: var(--jane-border-bright) !important; border-radius: 4px !important; }
::-webkit-scrollbar-thumb:hover { background: var(--jane-accent-dim) !important; }

::selection { background-color: var(--jane-accent) !important; color: var(--jane-bg-deep) !important; }

blockquote {
  border-left: 3px solid var(--jane-accent) !important;
  background-color: var(--jane-bg-surface) !important;
  color: var(--jane-text-dim) !important;
}

[class*="tooltip"], [class*="Tooltip"], [class*="popover"], [class*="Popover"],
[class*="dropdown"], [class*="Dropdown"], [class*="modal"], [class*="Modal"],
[class*="dialog"], [class*="Dialog"] {
  background-color: var(--jane-bg-elevated) !important;
  color: var(--jane-text) !important;
  border: 1px solid var(--jane-border-bright) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
}

[style*="background: white"], [style*="background-color: white"],
[style*="background: #fff"], [style*="background-color: #fff"],
[style*="background: rgb(255"], [style*="background-color: rgb(255"] {
  background-color: var(--jane-bg-deep) !important;
}
`;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 600,
    minHeight: 400,
    title: 'Jane',
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0a0e14',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, 'icon.png'),
  });

  win.webContents.on('did-finish-load', () => {
    win.webContents.insertCSS(JANE_CSS);
  });

  // Re-inject CSS on navigation
  win.webContents.on('did-navigate', () => {
    win.webContents.insertCSS(JANE_CSS);
  });
  win.webContents.on('did-navigate-in-page', () => {
    win.webContents.insertCSS(JANE_CSS);
  });

  win.loadURL('https://agent-s.app/');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
