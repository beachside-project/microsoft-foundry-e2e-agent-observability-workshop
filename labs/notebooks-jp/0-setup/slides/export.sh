#!/bin/bash
# =============================================================================
# Export MARP slides to PDF, HTML, and PPTX formats
# Requires: npm install -g @marp-team/marp-cli
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INPUT="$SCRIPT_DIR/slides.md"
OUTPUT_DIR="$SCRIPT_DIR/output"

if ! command -v marp &> /dev/null; then
    echo "❌ MARP CLI not found. Install it with:"
    echo "   npm install -g @marp-team/marp-cli"
    exit 1
fi

if [ ! -f "$INPUT" ]; then
    echo "❌ slides.md not found at $INPUT"
    exit 1
fi

mkdir -p "$OUTPUT_DIR"

echo "📄 Exporting to HTML..."
marp "$INPUT" --html --allow-local-files -o "$OUTPUT_DIR/slides.html"

echo "📕 Exporting to PDF..."
marp "$INPUT" --pdf --html --allow-local-files -o "$OUTPUT_DIR/slides.pdf"

echo "📊 Exporting to PPTX..."
marp "$INPUT" --pptx --html --allow-local-files -o "$OUTPUT_DIR/slides.pptx"

echo ""
echo "✅ Export complete! Files saved to:"
echo "   $OUTPUT_DIR/slides.html"
echo "   $OUTPUT_DIR/slides.pdf"
echo "   $OUTPUT_DIR/slides.pptx"
