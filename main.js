const { app, BrowserWindow, screen, session } = require('electron');
const path = require('path');
const fs = require('fs');

// ─── Persistent window state ─────────────────────────────────────────────────
const STATE_FILE = path.join(app.getPath('userData'), 'window-state.json');

function loadWindowState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return null;
  }
}

function saveWindowState(win) {
  if (!win || win.isDestroyed()) return;
  const bounds = win.getBounds();
  const maximized = win.isMaximized();
  fs.writeFileSync(STATE_FILE, JSON.stringify({ bounds, maximized }), 'utf8');
}

// ─── Comprehensive dark theme CSS ────────────────────────────────────────────
// The key fix: override ALL text and background colors with high-specificity
// rules that cover every element, not just class-pattern matches.
const JANE_CSS = `
/* ═══════════════════════════════════════════════════════════════════════════
   JANE DARK THEME — comprehensive override for Agent S
   ═══════════════════════════════════════════════════════════════════════════ */

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
  --jane-yellow: #e3b341;
  --jane-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', 'Menlo', monospace;
  color-scheme: dark !important;
}

/* ─── NUCLEAR TEXT + BACKGROUND RESET ─────────────────────────────────────
   This is the critical fix: force light text on EVERYTHING by default,
   then selectively style specific components. Without this, any element
   the site styles with dark text but we make transparent will be invisible. */

html, body {
  background-color: var(--jane-bg-deep) !important;
  color: var(--jane-text) !important;
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
  overflow: hidden !important;
}

/* Force light text on every element. This is the single most important rule. */
*, *::before, *::after {
  color: inherit !important;
  border-color: var(--jane-border) !important;
}

/* Broad element text color — catches what inherit misses */
body, div, span, p, li, ul, ol, dl, dt, dd, label, legend,
section, main, aside, nav, header, footer, article, figure, figcaption,
details, summary, fieldset, form, table, caption, thead, tbody, tfoot {
  color: var(--jane-text) !important;
}

/* ─── LAYOUT CONTAINERS ───────────────────────────────────────────────────── */

/* Root app shell: deep background */
body > div,
body > div > div,
body > div > div > div,
[id="root"],
[id="app"],
[id="__next"],
[class*="app"], [class*="App"],
[class*="layout"], [class*="Layout"],
[class*="container"], [class*="Container"],
[class*="wrapper"], [class*="Wrapper"],
[class*="main"], [class*="Main"],
[class*="page"], [class*="Page"],
[class*="content"], [class*="Content"],
[class*="view"], [class*="View"],
[class*="shell"], [class*="Shell"],
[class*="root"], [class*="Root"] {
  background-color: var(--jane-bg-deep) !important;
  color: var(--jane-text) !important;
}

/* Sidebars and navigation panels */
[class*="sidebar"], [class*="Sidebar"],
[class*="nav"], [class*="Nav"],
[class*="panel"], [class*="Panel"],
[class*="drawer"], [class*="Drawer"],
[class*="aside"], [class*="menu"], [class*="Menu"],
[class*="list"], [class*="List"],
[role="navigation"],
[role="complementary"] {
  background-color: var(--jane-bg) !important;
  color: var(--jane-text) !important;
  border-right-color: var(--jane-border) !important;
  border-left-color: var(--jane-border) !important;
}

/* Headers and toolbars */
[class*="header"], [class*="Header"],
[class*="toolbar"], [class*="Toolbar"],
[class*="topbar"], [class*="Topbar"],
[class*="titlebar"], [class*="Titlebar"],
[class*="banner"], [class*="Banner"],
[role="banner"] {
  background-color: var(--jane-bg) !important;
  color: var(--jane-text-bright) !important;
  border-bottom-color: var(--jane-border) !important;
}

/* ─── CHAT & MESSAGES ─────────────────────────────────────────────────────── */

[class*="chat"], [class*="Chat"],
[class*="message"], [class*="Message"],
[class*="conversation"], [class*="Conversation"],
[class*="thread"], [class*="Thread"],
[class*="history"], [class*="History"] {
  background-color: var(--jane-bg-deep) !important;
  color: var(--jane-text) !important;
}

/* AI/assistant messages */
[class*="assistant"], [class*="Assistant"],
[class*="bot"], [class*="Bot"],
[class*="response"], [class*="Response"],
[class*="agent"], [class*="Agent"],
[class*="reply"], [class*="Reply"],
[class*="ai-"], [class*="AI"] {
  background-color: var(--jane-bg-surface) !important;
  color: var(--jane-text-bright) !important;
  border: 1px solid var(--jane-border) !important;
  border-radius: 8px !important;
}

/* User messages */
[class*="user-message"], [class*="UserMessage"],
[class*="human"], [class*="Human"],
[class*="user"][class*="message"],
[class*="sent"] {
  background-color: var(--jane-bg-elevated) !important;
  color: var(--jane-text-bright) !important;
  border: 1px solid var(--jane-accent-dim) !important;
  border-radius: 8px !important;
}

/* Markdown content within messages */
[class*="markdown"], [class*="Markdown"],
[class*="prose"], [class*="Prose"],
[class*="rendered"], [class*="rich-text"] {
  color: var(--jane-text) !important;
}

[class*="markdown"] p, [class*="prose"] p,
[class*="markdown"] li, [class*="prose"] li,
[class*="markdown"] span, [class*="prose"] span {
  color: var(--jane-text) !important;
}

[class*="markdown"] strong, [class*="prose"] strong,
[class*="markdown"] b, [class*="prose"] b {
  color: var(--jane-text-bright) !important;
}

[class*="markdown"] em, [class*="prose"] em,
[class*="markdown"] i, [class*="prose"] i {
  color: var(--jane-text) !important;
}

/* ─── TEXT INPUT & COMPOSER ────────────────────────────────────────────────── */

textarea, input, select, option,
input[type="text"], input[type="email"], input[type="password"],
input[type="search"], input[type="tel"], input[type="url"], input[type="number"],
[class*="input"], [class*="Input"],
[class*="composer"], [class*="Composer"],
[class*="editor"], [class*="Editor"],
[class*="search"], [class*="Search"],
[class*="field"], [class*="Field"],
[role="textbox"],
[role="searchbox"],
[contenteditable="true"] {
  background-color: var(--jane-bg-surface) !important;
  color: var(--jane-text-bright) !important;
  -webkit-text-fill-color: var(--jane-text-bright) !important;
  border: 1px solid var(--jane-border-bright) !important;
  border-radius: 8px !important;
  caret-color: var(--jane-accent) !important;
  transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
}

/* Autofill override - Chromium injects dark text via -webkit-text-fill-color */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-text-fill-color: var(--jane-text-bright) !important;
  -webkit-box-shadow: 0 0 0 30px var(--jane-bg-surface) inset !important;
  background-color: var(--jane-bg-surface) !important;
  color: var(--jane-text-bright) !important;
  caret-color: var(--jane-accent) !important;
}

textarea::placeholder, input::placeholder,
[contenteditable="true"]:empty::before {
  color: var(--jane-text-dim) !important;
  opacity: 1 !important;
}

textarea:focus, input:focus, select:focus,
[role="textbox"]:focus, [contenteditable="true"]:focus {
  border-color: var(--jane-accent) !important;
  box-shadow: 0 0 0 2px var(--jane-accent-glow), 0 0 20px var(--jane-accent-glow) !important;
  outline: none !important;
}

/* ─── BUTTONS ─────────────────────────────────────────────────────────────── */

button, [role="button"],
[class*="btn"], [class*="Btn"],
[class*="button"], [class*="Button"] {
  background-color: var(--jane-bg-elevated) !important;
  color: var(--jane-text) !important;
  border: 1px solid var(--jane-border-bright) !important;
  transition: all 0.15s ease !important;
  cursor: pointer !important;
}

button:hover, [role="button"]:hover,
[class*="btn"]:hover, [class*="button"]:hover {
  background-color: var(--jane-accent-dim) !important;
  color: var(--jane-bg-deep) !important;
  border-color: var(--jane-accent) !important;
}

button:active, [role="button"]:active {
  background-color: var(--jane-accent) !important;
  transform: scale(0.98) !important;
}

/* Primary / submit / send buttons */
button[type="submit"],
[class*="primary"], [class*="Primary"],
[class*="send"], [class*="Send"],
[class*="submit"], [class*="Submit"],
[class*="cta"], [class*="action"] {
  background-color: var(--jane-accent-dim) !important;
  color: var(--jane-bg-deep) !important;
  border-color: var(--jane-accent) !important;
  font-weight: 600 !important;
}

button[type="submit"]:hover,
[class*="primary"]:hover, [class*="send"]:hover {
  background-color: var(--jane-accent) !important;
  box-shadow: 0 0 12px var(--jane-accent-glow) !important;
}

/* Danger / destructive buttons */
[class*="danger"], [class*="Danger"],
[class*="delete"], [class*="Delete"],
[class*="destructive"] {
  background-color: transparent !important;
  color: var(--jane-red) !important;
  border-color: var(--jane-red) !important;
}

[class*="danger"]:hover, [class*="delete"]:hover {
  background-color: var(--jane-red) !important;
  color: var(--jane-bg-deep) !important;
}

/* Icon-only buttons (don't force bg on tiny icon buttons) */
button svg, [role="button"] svg {
  fill: currentColor !important;
  color: inherit !important;
}

/* ─── CODE BLOCKS ─────────────────────────────────────────────────────────── */

pre, code, kbd, samp, var,
[class*="code"], [class*="Code"],
[class*="codeblock"], [class*="CodeBlock"],
[class*="syntax"], [class*="Syntax"],
[class*="highlight"], [class*="Highlight"] {
  background-color: var(--jane-bg) !important;
  color: var(--jane-green) !important;
  font-family: var(--jane-mono) !important;
  border: 1px solid var(--jane-border) !important;
  border-radius: 6px !important;
}

/* Inline code vs block code */
code {
  padding: 2px 6px !important;
  font-size: 0.9em !important;
}

pre code {
  padding: 0 !important;
  border: none !important;
  background: transparent !important;
}

pre {
  padding: 16px !important;
  overflow-x: auto !important;
}

/* Code block header (copy button area) */
[class*="code"] [class*="header"],
[class*="code"] [class*="toolbar"],
[class*="code"] [class*="title"],
[class*="code"] [class*="lang"] {
  background-color: var(--jane-bg-surface) !important;
  color: var(--jane-text-dim) !important;
  border-bottom: 1px solid var(--jane-border) !important;
}

/* Syntax highlighting token colors */
.token.comment, .token.prolog, .token.doctype, .token.cdata { color: var(--jane-text-dim) !important; }
.token.punctuation { color: var(--jane-text) !important; }
.token.property, .token.tag, .token.constant, .token.symbol, .token.deleted { color: var(--jane-red) !important; }
.token.boolean, .token.number { color: var(--jane-orange) !important; }
.token.selector, .token.attr-name, .token.string, .token.char, .token.builtin, .token.inserted { color: var(--jane-green) !important; }
.token.operator, .token.entity, .token.url { color: var(--jane-accent) !important; }
.token.atrule, .token.attr-value, .token.keyword { color: var(--jane-accent) !important; }
.token.function, .token.class-name { color: var(--jane-yellow) !important; }
.token.regex, .token.important, .token.variable { color: var(--jane-orange) !important; }

/* ─── LINKS ───────────────────────────────────────────────────────────────── */

a, a:visited, a:link {
  color: var(--jane-accent) !important;
  text-decoration: none !important;
}

a:hover {
  color: var(--jane-green) !important;
  text-decoration: underline !important;
}

/* ─── HEADINGS ────────────────────────────────────────────────────────────── */

h1, h2, h3, h4, h5, h6 {
  color: var(--jane-text-bright) !important;
}

h1 { color: var(--jane-accent) !important; }
h2 { color: var(--jane-text-bright) !important; }

/* ─── TABLES ──────────────────────────────────────────────────────────────── */

table { border-collapse: collapse !important; width: 100% !important; }
th {
  background-color: var(--jane-bg-elevated) !important;
  color: var(--jane-accent) !important;
  font-weight: 600 !important;
}
td, th {
  border: 1px solid var(--jane-border) !important;
  padding: 8px 12px !important;
  color: var(--jane-text) !important;
}
tr:nth-child(even) td { background-color: var(--jane-bg-surface) !important; }
tr:hover td { background-color: var(--jane-bg-elevated) !important; }

/* ─── LISTS ───────────────────────────────────────────────────────────────── */

ul, ol { color: var(--jane-text) !important; }
li { color: var(--jane-text) !important; }
li::marker { color: var(--jane-accent) !important; }

/* ─── SCROLLBARS ──────────────────────────────────────────────────────────── */

::-webkit-scrollbar { width: 8px !important; height: 8px !important; }
::-webkit-scrollbar-track { background: var(--jane-bg-deep) !important; }
::-webkit-scrollbar-thumb {
  background: var(--jane-border-bright) !important;
  border-radius: 4px !important;
}
::-webkit-scrollbar-thumb:hover { background: var(--jane-accent-dim) !important; }
::-webkit-scrollbar-corner { background: var(--jane-bg-deep) !important; }

/* ─── SELECTION ───────────────────────────────────────────────────────────── */

::selection {
  background-color: var(--jane-accent) !important;
  color: var(--jane-bg-deep) !important;
}

/* ─── QUOTES & CALLOUTS ──────────────────────────────────────────────────── */

blockquote {
  border-left: 3px solid var(--jane-accent) !important;
  background-color: var(--jane-bg-surface) !important;
  color: var(--jane-text) !important;
  padding: 8px 16px !important;
  margin: 8px 0 !important;
}

/* ─── MODALS, TOOLTIPS, POPUPS ────────────────────────────────────────────── */

[class*="tooltip"], [class*="Tooltip"],
[class*="popover"], [class*="Popover"],
[class*="dropdown"], [class*="Dropdown"],
[class*="modal"], [class*="Modal"],
[class*="dialog"], [class*="Dialog"],
[class*="overlay"], [class*="Overlay"],
[class*="popup"], [class*="Popup"],
[class*="sheet"], [class*="Sheet"],
[role="dialog"], [role="tooltip"], [role="menu"],
[role="listbox"], [role="alertdialog"] {
  background-color: var(--jane-bg-elevated) !important;
  color: var(--jane-text) !important;
  border: 1px solid var(--jane-border-bright) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6) !important;
}

/* Menu items */
[role="menuitem"], [role="option"],
[class*="menu-item"], [class*="MenuItem"],
[class*="dropdown-item"], [class*="DropdownItem"],
[class*="option"], [class*="Option"],
[class*="select"], [class*="Select"] {
  background-color: transparent !important;
  color: var(--jane-text) !important;
}

[role="menuitem"]:hover, [role="option"]:hover,
[class*="menu-item"]:hover, [class*="option"]:hover,
[role="option"][aria-selected="true"],
[class*="active"], [class*="Active"],
[class*="selected"], [class*="Selected"],
[class*="highlighted"], [class*="Highlighted"] {
  background-color: var(--jane-bg-surface) !important;
  color: var(--jane-text-bright) !important;
}

/* ─── BADGES, TAGS, CHIPS ─────────────────────────────────────────────────── */

[class*="badge"], [class*="Badge"],
[class*="tag"], [class*="Tag"],
[class*="chip"], [class*="Chip"],
[class*="pill"], [class*="Pill"],
[class*="label"], [class*="Label"],
[class*="status"], [class*="Status"] {
  background-color: var(--jane-bg-elevated) !important;
  color: var(--jane-text) !important;
  border: 1px solid var(--jane-border) !important;
}

/* ─── LOADING / SKELETON STATES ───────────────────────────────────────────── */

[class*="loading"], [class*="Loading"],
[class*="skeleton"], [class*="Skeleton"],
[class*="spinner"], [class*="Spinner"],
[class*="placeholder"], [class*="Placeholder"] {
  background-color: var(--jane-bg-surface) !important;
  color: var(--jane-text-dim) !important;
}

/* ─── SEPARATORS / DIVIDERS ───────────────────────────────────────────────── */

hr, [class*="divider"], [class*="Divider"],
[class*="separator"], [class*="Separator"] {
  border-color: var(--jane-border) !important;
  background-color: var(--jane-border) !important;
  opacity: 1 !important;
}

/* ─── TOAST / NOTIFICATION ────────────────────────────────────────────────── */

[class*="toast"], [class*="Toast"],
[class*="notification"], [class*="Notification"],
[class*="alert"], [class*="Alert"],
[class*="snackbar"], [class*="Snackbar"],
[role="alert"], [role="status"] {
  background-color: var(--jane-bg-elevated) !important;
  color: var(--jane-text) !important;
  border: 1px solid var(--jane-border-bright) !important;
}

/* ─── IMAGES & AVATARS ────────────────────────────────────────────────────── */

img, video, canvas, svg:not([class*="icon"]) {
  /* Don't invert actual content images, but ensure they're visible */
  opacity: 1 !important;
}

[class*="avatar"], [class*="Avatar"] {
  border: 2px solid var(--jane-border-bright) !important;
  border-radius: 50% !important;
}

/* ─── CHECKBOXES, RADIOS, TOGGLES ─────────────────────────────────────────── */

input[type="checkbox"], input[type="radio"] {
  accent-color: var(--jane-accent) !important;
}

[class*="toggle"], [class*="Toggle"],
[class*="switch"], [class*="Switch"],
[role="switch"] {
  background-color: var(--jane-bg-elevated) !important;
  border-color: var(--jane-border-bright) !important;
}

[class*="toggle"][class*="active"],
[class*="switch"][class*="active"],
[role="switch"][aria-checked="true"] {
  background-color: var(--jane-accent-dim) !important;
}

/* ─── TABS ────────────────────────────────────────────────────────────────── */

[role="tab"], [class*="tab"], [class*="Tab"] {
  background-color: transparent !important;
  color: var(--jane-text-dim) !important;
  border-bottom: 2px solid transparent !important;
}

[role="tab"][aria-selected="true"],
[class*="tab"][class*="active"],
[class*="tab"][class*="selected"] {
  color: var(--jane-accent) !important;
  border-bottom-color: var(--jane-accent) !important;
}

[role="tabpanel"], [class*="tabpanel"], [class*="TabPanel"],
[class*="tab-content"], [class*="TabContent"] {
  background-color: var(--jane-bg-deep) !important;
  color: var(--jane-text) !important;
}

/* ─── FORM ELEMENTS ───────────────────────────────────────────────────────── */

label, legend {
  color: var(--jane-text) !important;
}

fieldset {
  border-color: var(--jane-border) !important;
}

select {
  background-color: var(--jane-bg-surface) !important;
  color: var(--jane-text-bright) !important;
}

option {
  background-color: var(--jane-bg-elevated) !important;
  color: var(--jane-text) !important;
}

/* ─── PROGRESS, METERS ────────────────────────────────────────────────────── */

progress, meter {
  accent-color: var(--jane-accent) !important;
}

[class*="progress"], [class*="Progress"] {
  background-color: var(--jane-bg-surface) !important;
}

[class*="progress"] [class*="bar"],
[class*="progress"] [class*="fill"] {
  background-color: var(--jane-accent) !important;
}

/* ─── FORCE OVERRIDE INLINE STYLES ────────────────────────────────────────── */

/* Catch inline white backgrounds */
[style*="background: white"], [style*="background-color: white"],
[style*="background: #fff"], [style*="background-color: #fff"],
[style*="background: rgb(255"], [style*="background-color: rgb(255"],
[style*="background:#fff"], [style*="background-color:#fff"],
[style*="background: #FFF"], [style*="background-color: #FFF"],
[style*="background: #ffffff"], [style*="background-color: #ffffff"] {
  background-color: var(--jane-bg-deep) !important;
}

/* Catch inline dark text */
[style*="color: black"], [style*="color: #000"],
[style*="color: rgb(0"], [style*="color:#000"],
[style*="color: #333"], [style*="color:#333"],
[style*="color: #222"], [style*="color:#222"],
[style*="color: #111"], [style*="color:#111"] {
  color: var(--jane-text) !important;
}

/* ─── SMOOTH TRANSITIONS ──────────────────────────────────────────────────── */
/* Avoid flickering when CSS is injected */
html {
  transition: background-color 0.1s ease !important;
}

/* ─── FULL HEIGHT / FIT WINDOW ────────────────────────────────────────────── */
html, body, #root, #app, #__next,
body > div:first-child {
  height: 100% !important;
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
}

/* Make the main content area fill available space */
[class*="layout"], [class*="Layout"],
[class*="app"], [class*="App"],
[class*="shell"], [class*="Shell"] {
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
}

/* Ensure chat/message area scrolls properly within bounds */
[class*="messages"], [class*="Messages"],
[class*="chat-area"], [class*="ChatArea"],
[class*="scroll"], [class*="Scroll"],
[class*="conversation-body"], [class*="thread-body"] {
  overflow-y: auto !important;
  flex: 1 !important;
}

/* ─── DRAG REGION for frameless titlebar ──────────────────────────────────── */
body::before {
  content: '';
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 28px;
  -webkit-app-region: drag;
  z-index: 999999;
  pointer-events: auto;
}

/* Don't let the drag region eat clicks on actual buttons in the header */
body::before ~ * [class*="header"] button,
body::before ~ * [class*="Header"] button,
body::before ~ * nav button,
body::before ~ * [class*="toolbar"] button {
  -webkit-app-region: no-drag;
}
`;

// ─── Preload-style JS injection for SPA resilience ───────────────────────────
// Agent S is a React SPA. CSS alone handles most things, but we also inject
// a small script that watches for style attribute mutations and fixes them.
const JANE_JS = `
(function() {
  'use strict';

  // Periodically check for and fix elements with inline styles that override our theme
  const fixInlineStyles = () => {
    // Fix elements with white/light background inline styles
    document.querySelectorAll('[style]').forEach(el => {
      const style = el.getAttribute('style') || '';
      if (/background(-color)?\\s*:\\s*(white|#fff|#ffffff|rgb\\(255/i.test(style)) {
        el.style.setProperty('background-color', '#0a0e14', 'important');
      }
      if (/(?:^|;)\\s*color\\s*:\\s*(black|#000|#111|#222|#333|rgb\\(0/i.test(style)) {
        el.style.setProperty('color', '#c9d1d9', 'important');
      }
    });
  };

  // Run immediately and on DOM changes
  fixInlineStyles();

  const observer = new MutationObserver((mutations) => {
    let needsFix = false;
    for (const m of mutations) {
      if (m.type === 'attributes' && m.attributeName === 'style') {
        needsFix = true;
        break;
      }
      if (m.type === 'childList' && m.addedNodes.length > 0) {
        needsFix = true;
        break;
      }
    }
    if (needsFix) {
      requestAnimationFrame(fixInlineStyles);
    }
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['style'],
    childList: true,
    subtree: true,
  });
})();
`;

// ─── Window creation ─────────────────────────────────────────────────────────
function createWindow() {
  const saved = loadWindowState();
  const { width: screenW, height: screenH } = screen.getPrimaryDisplay().workAreaSize;

  // Smart defaults: 85% of screen, centered, or restore last position
  const defaults = {
    width: Math.round(screenW * 0.85),
    height: Math.round(screenH * 0.9),
    x: Math.round(screenW * 0.075),
    y: Math.round(screenH * 0.05),
  };

  const bounds = saved?.bounds || defaults;

  // Validate saved bounds are still on-screen
  if (saved?.bounds) {
    const displays = screen.getAllDisplays();
    const onScreen = displays.some(d => {
      const db = d.bounds;
      return bounds.x >= db.x - 100 &&
             bounds.y >= db.y - 100 &&
             bounds.x < db.x + db.width &&
             bounds.y < db.y + db.height;
    });
    if (!onScreen) {
      Object.assign(bounds, defaults);
    }
  }

  const win = new BrowserWindow({
    width: bounds.width,
    height: bounds.height,
    x: bounds.x,
    y: bounds.y,
    minWidth: 680,
    minHeight: 500,
    title: 'Jane',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 12, y: 10 },
    backgroundColor: '#0a0e14',
    show: false, // Don't show until ready — avoids white flash
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, 'icon.png'),
  });

  // Restore maximized state
  if (saved?.maximized) {
    win.maximize();
  }

  // Show window only when content is ready — prevents flash of white
  win.once('ready-to-show', () => {
    win.show();
    win.focus();
  });

  // ── CSS + JS injection on every load event ──
  const injectTheme = () => {
    win.webContents.insertCSS(JANE_CSS).catch(() => {});
    win.webContents.executeJavaScript(JANE_JS).catch(() => {});
  };

  win.webContents.on('did-finish-load', injectTheme);
  win.webContents.on('did-navigate', injectTheme);
  win.webContents.on('did-navigate-in-page', injectTheme);

  // Also inject on DOM ready (earlier than did-finish-load)
  win.webContents.on('dom-ready', () => {
    win.webContents.insertCSS(JANE_CSS).catch(() => {});
  });

  // ── Save window state on resize/move ──
  let saveTimeout;
  const debouncedSave = () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => saveWindowState(win), 500);
  };

  win.on('resize', debouncedSave);
  win.on('move', debouncedSave);
  win.on('close', () => saveWindowState(win));

  // ── Open external links in default browser ──
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith('https://agent-s.app')) {
      require('electron').shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  // ── Custom user agent to avoid bot detection ──
  const defaultUA = win.webContents.getUserAgent();
  win.webContents.setUserAgent(defaultUA.replace(/Electron\/\S+\s/, ''));

  win.loadURL('https://agent-s.app/');
}

// ─── App lifecycle ───────────────────────────────────────────────────────────
app.whenReady().then(() => {
  // Set app-level CSP to allow our injections
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        // Remove restrictive CSP that might block our CSS injection
        'content-security-policy': undefined,
      },
    });
  });

  createWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ─── Security: prevent new window creation for phishing ──────────────────────
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    if (parsedUrl.origin !== 'https://agent-s.app') {
      event.preventDefault();
    }
  });
});
