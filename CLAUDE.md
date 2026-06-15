# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

An interactive Electron-based presentation for the Cardo Systems internal Cursor AI workshop. Seven HTML slides that teach developers how to use Cursor AI. No build step — vanilla HTML/CSS/JS packaged with Electron.

## Running the App

```powershell
npm install          # first time only
npx electron .       # launch the Electron app
```

Individual slides can be opened directly in a browser for quick iteration — navigation and animations work without Electron.

## Packaging for Distribution

```powershell
npx electron-builder
```

## Architecture

**Navigation (`nav.js`)** — shared controller loaded by every slide. Detects the current slide from the URL filename, manages prev/next navigation, keyboard shortcuts (arrow keys, `?` for help overlay), progress bar, and dot-nav in the header. Each slide is defined in a `SLIDES` array with `{ file, title }` entries. Navigation direction is stored in `sessionStorage` to drive entrance animations.

**Slides** — 7 standalone HTML files: `index.html` → `problem.html` → `blocks.html` → `rules.html` → `skills.html` → `loop.html` → `cta.html`. Each includes the shared header/footer scaffold, background orb elements, and loads `nav.js` + `shared.css`.

**Shared CSS (`shared.css`)** — design system with CSS custom properties. Key tokens: `--teal` (`#0099cc`), `--bg` (`#070c1a`), `--purple`. Glassmorphism effects via `backdrop-filter`. Entrance animation classes `.d0`–`.d7` apply staggered `animation-delay`. Typography: Syne (display), DM Sans (body), DM Mono (code) — loaded from Google Fonts.

**Workshop defaults (`workshop-defaults.js`)** — loads/saves form field state to `localStorage` under the key `cursorWorkflowAnswers`. Contains Cardo-specific prefill values (embedded C stack, ADO, QCC3095). Exports `loadFormDefaults()`, `saveFormDefaults()`, `clearFormDefaults()`.

## Slide-Specific Logic

Each slide keeps its interactivity self-contained in a `<script>` tag at the bottom of the file:

| Slide | Key behaviour |
|---|---|
| `index.html` | Animated counter 0→30 on load |
| `blocks.html` | Click-to-activate card grid |
| `rules.html` | File-tree tabs swap code editor content |
| `skills.html` | Command list selection updates detail panel |
| `loop.html` | Step cards expand a detail panel below |
| `cta.html` | Checklist cards toggle checked state |

## Conventions

- No TypeScript, no bundler, no framework — keep it plain HTML/CSS/JS.
- New slides go into the `SLIDES` array in `nav.js` and get a corresponding `.html` file following the existing header/footer/orbs scaffold.
- Entrance animations: add `class="d0"` through `class="d7"` on elements that should stagger in; the CSS handles the rest.
- `main.js` is the Electron entry point — it opens `index.html` in a `BrowserWindow`.
