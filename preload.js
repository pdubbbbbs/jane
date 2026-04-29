// Preload script — runs before page content loads in every frame
// Nuclear option for ensuring input fields have light text everywhere,
// including login screens that may load before insertCSS fires.

const EARLY_CSS = `
/* Maximum specificity input overrides — fires before React hydrates */
html body input,
html body input[type="text"],
html body input[type="email"],
html body input[type="password"],
html body input[type="search"],
html body input[type="tel"],
html body input[type="url"],
html body input[type="number"],
html body textarea,
html body select,
html body [contenteditable="true"],
html body [role="textbox"] {
  color: #e6edf3 !important;
  -webkit-text-fill-color: #e6edf3 !important;
  background-color: #151b23 !important;
  border-color: #253347 !important;
  caret-color: #00d4ff !important;
}

html body input:-webkit-autofill,
html body input:-webkit-autofill:hover,
html body input:-webkit-autofill:focus,
html body input:-webkit-autofill:active {
  -webkit-text-fill-color: #e6edf3 !important;
  -webkit-box-shadow: 0 0 0 30px #151b23 inset !important;
  background-color: #151b23 !important;
  color: #e6edf3 !important;
  caret-color: #00d4ff !important;
}

html body input::placeholder,
html body textarea::placeholder {
  color: #7a8599 !important;
  -webkit-text-fill-color: #7a8599 !important;
  opacity: 1 !important;
}

html body input:focus,
html body textarea:focus {
  border-color: #00d4ff !important;
  box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.15) !important;
  outline: none !important;
}

/* Global text color safety net */
html, body {
  background-color: #0a0e14 !important;
  color: #c9d1d9 !important;
  color-scheme: dark !important;
}

html body div, html body span, html body p,
html body h1, html body h2, html body h3, html body h4, html body h5, html body h6,
html body a, html body label, html body li, html body td, html body th {
  color: #c9d1d9 !important;
}

html body a { color: #00d4ff !important; }
html body button, html body [role="button"] { color: #c9d1d9 !important; }
`;

function inject() {
  const style = document.createElement('style');
  style.id = 'jane-preload-theme';
  style.textContent = EARLY_CSS;
  (document.head || document.documentElement).appendChild(style);

  // Watch for iframes and inject into them too
  const injectFrame = (iframe) => {
    try {
      const doc = iframe.contentDocument;
      if (doc && !doc.getElementById('jane-preload-theme')) {
        const s = doc.createElement('style');
        s.id = 'jane-preload-theme';
        s.textContent = EARLY_CSS;
        (doc.head || doc.documentElement).appendChild(s);
      }
    } catch(e) { /* cross-origin */ }
  };

  const obs = new MutationObserver(() => {
    document.querySelectorAll('iframe').forEach(injectFrame);
  });

  if (document.body) {
    obs.observe(document.body, { childList: true, subtree: true });
    document.querySelectorAll('iframe').forEach(injectFrame);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      obs.observe(document.body, { childList: true, subtree: true });
      document.querySelectorAll('iframe').forEach(injectFrame);
    });
  }
}

if (document.documentElement) {
  inject();
} else {
  document.addEventListener('DOMContentLoaded', inject);
}
