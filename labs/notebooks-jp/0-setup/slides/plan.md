# Slide Deck Plan: "Observe, Optimize & Protect Your AI Agents in Microsoft Foundry"

## Overview

- **Format**: MARP CLI Markdown presentation (`slides.md`)
- **Duration**: 60 minutes (target pacing via speaker notes)
- **Audience**: Workshop attendees — works for live instructor-led presentation AND standalone self-paced reading
- **Scenario**: Contoso Travel (consistent with all labs)
- **Location**: `labs/notebooks/0-setup/slides/`
- **Images**: Reference existing screenshots from `../assets/` folder; use placeholders where images don't exist

## Slide Structure (4 Steps from README)

### Opening Section (~5 min, ~4 slides)

| # | Slide | Notes |
|---|-------|-------|
| 1 | Title Slide | Workshop title, session description, duration |
| 2 | Contoso Travel Scenario | The application scenario — why an AI travel assistant? |
| 3 | Learning Objectives | Observe, Optimize, Protect, Deploy |
| 4 | Workshop Paths Overview | Base Path (Steps 1-2) + Path A (Step 3) vs Path B (Step 4) |

### Step 1: Infrastructure Setup (~15 min, ~10 slides)

| # | Slide | Image Reference |
|---|-------|----------------|
| 5 | Step 1 Title — Infrastructure Setup | — |
| 6 | Visit Templates Page | `01-templates-page.png` |
| 7 | Select / Create Project | `02-select-project.png`, `03-create-project.png` |
| 8 | Project Details & Creation | `04-create-project-details.png`, `05-create-in-progress.png` |
| 9 | Project Created — Note Endpoint | `06-project-created.png` |
| 10 | Create Agent | `07-create-agent.png`, `08-create-in-progress.png` |
| 11 | Agent Playground Ready | `09-agent-playground-ready.png` |
| 12 | Connect App Insights | `10-create-app-insights.png`, `11-create-app-insights-detail.png` |
| 13 | Test Agent with Prompt | `14-test-agent-prompt.png` |
| 14 | View Metrics & Traces | `15-view-agent-metrics.png`, `20-view-agent-trace.png` |
| 15 | Configure Agent Properties | `16-configure-agent-properties.png`, `17-review-configured-agent.png` |
| 16 | Evaluations & Red Teaming Overview | `28-evaluations-catalog.png`, `29-red-teaming-create.png` |

### Step 2: Dev Environment Setup (~5 min, ~4 slides)

| # | Slide | Image Reference |
|---|-------|----------------|
| 17 | Step 2 Title — Dev Environment Setup | — |
| 18 | Fork Repo & Launch Codespaces | — (placeholder) |
| 19 | Run setup-env.sh Script | `26-run-env-script.png`, `27-dev-env-ready.png` |
| 20 | Choose Your Adventure | Paths A vs B decision point |

### Step 3: Foundry Skills Path (~15 min, ~8 slides)

| # | Slide | Image Reference |
|---|-------|----------------|
| 21 | Step 3 Title — Observe with Foundry Skills | — |
| 22 | What Are Foundry Skills? | Sub-skills table |
| 23 | Set Default Project in AI Toolkit | — (placeholder) |
| 24 | Verify Skill Installation | — (placeholder) |
| 25 | Explore Sub-Skills | `30-observability-loop.png`, `31-entry-points.png` |
| 26 | The Observe Loop | `32-loop-overview.png` |
| 27 | Activate GitHub Copilot Chat | Prompt example |
| 28 | Capture & Share Feedback | What you can try — evals, optimization, comparison |

### Step 4: Foundry SDK Path (~15 min, ~8 slides)

| # | Slide | Image Reference |
|---|-------|----------------|
| 29 | Step 4 Title — Build with Foundry SDK | — |
| 30 | How to Run Notebooks | Kernel selection, run one cell at a time |
| 31 | Lab 01: Validate Environment | `lab-01-setup.ipynb` |
| 32 | Lab 02: Create Basic Agent | `lab-02-agent.ipynb` |
| 33 | Lab 03: Add Tools & Workflows | `lab-03a-tools.ipynb`, `lab-03b-workflow.ipynb` |
| 34 | Lab 04: Instrument with Tracing | `lab-04-tracing.ipynb` |
| 35 | Lab 05: Run Evaluations | `lab-05-evaluation.ipynb` |
| 36 | Lab 06: Red Teaming | `lab-06-redteam.ipynb` |

### Closing Section (~5 min, ~4 slides)

| # | Slide | Image Reference |
|---|-------|----------------|
| 37 | Foundry Control Plane Overview | `foundry-control-plane.png` (from `labs/assets/`) |
| 38 | Key Takeaway | OTel + Responses API = works with any agent |
| 39 | Related Resources | Links table from README |
| 40 | Next Steps & Thank You | v2 preview, fork & watch |

**Total**: ~40 slides, ~60 minutes

## MARP Configuration

- **Theme**: `default` (with custom styling via inline CSS for Microsoft/Contoso branding)
- **Paginate**: Yes
- **Header/Footer**: Workshop title + page numbers
- **Size**: 16:9
- **HTML**: Enabled (for advanced layout with image grids)

## Export & Tooling

### Files to Create

1. **`slides.md`** — The MARP presentation source
2. **`export.sh`** — Shell script to export to PDF, HTML, and PPTX
3. **`README.md`** — Instructions for viewing, editing, and exporting the slides
4. **`package.json`** — (optional) npm scripts for convenience

### Export Script (`export.sh`)

```bash
#!/bin/bash
# Exports slides.md to PDF, HTML, and PPTX using MARP CLI
# Requires: npm install -g @marp-team/marp-cli

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INPUT="$SCRIPT_DIR/slides.md"
OUTPUT_DIR="$SCRIPT_DIR/output"

mkdir -p "$OUTPUT_DIR"

marp "$INPUT" --html --allow-local-files -o "$OUTPUT_DIR/slides.html"
marp "$INPUT" --pdf --html --allow-local-files -o "$OUTPUT_DIR/slides.pdf"
marp "$INPUT" --pptx --html --allow-local-files -o "$OUTPUT_DIR/slides.pptx"

echo "Exports complete. Files in $OUTPUT_DIR/"
```

### README.md (in slides folder)

- How to install MARP CLI (`npm install -g @marp-team/marp-cli`)
- How to preview locally (`marp -p slides.md`)
- How to export (`./export.sh`)
- Requirements (Node.js, Chromium for PDF/PPTX)

## Design Decisions

1. **Image paths**: Use relative paths `../assets/XX-name.png` since slides live in `0-setup/slides/` and images in `0-setup/assets/`
2. **Speaker notes**: Use MARP `<!-- speaker notes -->` syntax for timing guidance
3. **Dual-use**: Content-rich slides (not just bullet headers) so deck works standalone
4. **Contoso Travel**: Used as running example throughout, matching the lab content
5. **Both paths equal**: Steps 3 and 4 get equal slide counts and depth

## Requirements Status

- [x] MARP CLI format
- [x] 60-minute pacing
- [x] Based on 4 README steps
- [x] Images from 0-setup/assets
- [x] Export to PDF, HTML, PPTX
- [x] Plan stored as slides/plan.md
