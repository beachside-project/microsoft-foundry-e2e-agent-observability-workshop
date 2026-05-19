# Workshop Slide Deck

MARP-based presentation for the **"Observe, Optimize & Protect Your AI Agents in Microsoft Foundry"** workshop.

## Files

| File | Description |
|:---|:---|
| `slides.md` | MARP presentation source (~40 slides, 60 min) |
| `export.sh` | Export script for PDF, HTML, and PPTX |
| `plan.md` | Slide deck planning document |
| `output/` | Generated exports (gitignored) |

## Quick Start

### Preview Locally

```bash
# Install MARP CLI (one-time)
npm install -g @marp-team/marp-cli

# Start live preview with hot reload
marp -p slides.md
```

This opens a browser window with your slides. Changes to `slides.md` are reflected automatically.

### Export to PDF, HTML, PPTX

```bash
# Run the export script
./export.sh
```

Exports are saved to the `output/` directory:
- `output/slides.html` — Standalone HTML presentation
- `output/slides.pdf` — Print-ready PDF
- `output/slides.pptx` — PowerPoint format

### Export Individual Formats

```bash
# HTML only
marp slides.md --html --allow-local-files -o output/slides.html

# PDF only
marp slides.md --pdf --html --allow-local-files -o output/slides.pdf

# PPTX only
marp slides.md --pptx --html --allow-local-files -o output/slides.pptx
```

## Requirements

- **Node.js** v16+ ([nodejs.org](https://nodejs.org/))
- **MARP CLI** (`npm install -g @marp-team/marp-cli`)
- **Chromium** — required for PDF/PPTX export (installed automatically by MARP CLI via Puppeteer)

## Editing the Slides

The slides are written in standard Markdown with MARP extensions:

- **`---`** separates slides
- **Front matter** (top of file) configures theme, pagination, header/footer
- **`<!-- _class: title -->`** applies special slide classes
- **`![w:480](path)`** sets image width
- **`<!-- SPEAKER NOTES: ... -->`** adds presenter notes
- **Images** are in `../assets/` (the `0-setup/assets` folder)

### MARP Documentation

- [MARP Official Site](https://marp.app/)
- [Marpit Markdown](https://marpit.marp.app/markdown)
- [MARP CLI Reference](https://github.com/marp-team/marp-cli)
