# Jane

Dark standalone desktop app for [Agent S](https://agent-s.app/). Cyberpunk dark theme, no browser chrome, persistent window state.

## Features

- **Comprehensive dark theme** — covers all UI elements: chat, sidebar, inputs, buttons, code blocks, modals, dropdowns, menus, tooltips, tables, scrollbars, badges, tabs, and more
- **Window state persistence** — remembers size, position, and maximized state across sessions
- **No white flash** — window is hidden until content is ready
- **SPA-aware** — CSS re-injected on navigation; MutationObserver fixes inline style overrides in real-time
- **External link handling** — links outside Agent S open in your default browser
- **Frameless window** — macOS `hiddenInset` title bar with traffic light controls
- **Clean user agent** — strips Electron identifier so the site doesn't treat you like a bot

## Install & Run (dev)

```bash
git clone https://github.com/pdubbbbbs/jane.git
cd jane
npm install
npm start
```

## Build macOS app (Apple Silicon)

```bash
npm run build
```

The `.dmg` and `.zip` will be in `dist/`.

## Build other platforms

```bash
npm run build-mac-universal  # Universal binary (Intel + Apple Silicon)
npm run build-mac-x64        # Intel Mac
npm run build-linux           # Linux AppImage + deb
npm run build-win             # Windows NSIS installer
```

## Customization

Edit the CSS variables at the top of the `JANE_CSS` block in `main.js`:

| Variable | Purpose |
|---|---|
| `--jane-bg-deep` | Deepest background |
| `--jane-bg` | Primary background |
| `--jane-bg-surface` | Elevated surfaces |
| `--jane-accent` | Primary accent (cyan) |
| `--jane-green` | Code / success color |
| `--jane-red` | Error / danger color |
| `--jane-text` | Body text |
| `--jane-text-bright` | Headings and emphasis |
