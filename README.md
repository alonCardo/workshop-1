# Cursor AI Workshop — Presentation

Interactive Electron-based slide deck for the internal Cursor AI developer workshop. Seven slides that walk through the Cursor AI workflow, from problem framing to hands-on practice.

## Running

```powershell
npm install       # first time only
npx electron .    # launch the presentation
```

Individual slides can also be opened directly in a browser — navigation and animations work without Electron.

## Packaging

```powershell
npx electron-builder
```

Output goes to `dist/`.

## Slide Order

| File | Title |
|---|---|
| `index.html` | Title / intro (animated counter) |
| `problem.html` | The problem |
| `blocks.html` | Building blocks (click-to-activate cards) |
| `rules.html` | Rules (file-tree tabs + code editor) |
| `skills.html` | Skills (command list → detail panel) |
| `loop.html` | The loop (expandable step cards) |
| `cta.html` | Call to action (checklist) |

## Adding a Slide

1. Create a new `.html` file following the existing header/footer/orbs scaffold.
2. Add a `{ file, title }` entry to the `SLIDES` array in `nav.js`.
3. Use `class="d0"` through `class="d7"` on elements that should stagger in on entrance.

## Key Files

| File | Purpose |
|---|---|
| `nav.js` | Shared navigation controller (keyboard shortcuts, progress bar, dot-nav) |
| `shared.css` | Design system — CSS custom properties, glassmorphism, entrance animations |
| `workshop-defaults.js` | Loads/saves form field state to `localStorage` |
| `main.js` | Electron entry point |
