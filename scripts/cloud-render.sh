#!/bin/bash
# =============================================================
# cloud-render.sh — Deploy site S3 + Render tren Lambda + Auto-stop VM
# Usage:
#   bash cloud-render.sh <COMPOSITION_ID> [input-props-json]
#
# Vi du:
#   bash cloud-render.sh Paperclip
#   bash cloud-render.sh Paperclip '{"title":"Hello"}'
# =============================================================
set -e

SITE_NAME="video-studio"
REGION="us-east-1"
COMPOSITION_ID="${1:?'❌ Thieu COMPOSITION_ID. Vi du: bash cloud-render.sh Paperclip'}"
INPUT_PROPS="${2:-}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_FILE="$PROJECT_DIR/renders/render-$(date +%Y%m%d-%H%M%S).log"
AUTO_STOP="${AUTO_STOP:-false}"  # Set AUTO_STOP=true de tu dong tat VM sau render

mkdir -p "$PROJECT_DIR/renders"
cd "$PROJECT_DIR"

# Load env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "=============================================="
echo "🎬 Bat dau render: $COMPOSITION_ID"
echo "⏱  $(date '+%Y-%m-%d %H:%M:%S')"
echo "=============================================="

# ── Buoc 1: Re-deploy site len S3 ────────────────────────────
echo ""
echo "📦 [1/3] Re-deploy site len S3..."
npx remotion lambda sites create src/index.ts \
  --site-name="$SITE_NAME" 2>&1 | tee -a "$LOG_FILE"
echo "✅ Site deployed!"

# ── Buoc 2: Render tren Lambda ───────────────────────────────
echo ""
echo "⚡ [2/3] Dang render tren AWS Lambda..."

if [ -n "$INPUT_PROPS" ]; then
  RENDER_CMD="npx remotion lambda render $SITE_NAME $COMPOSITION_ID --region=$REGION --input-props='$INPUT_PROPS'"
else
  RENDER_CMD="npx remotion lambda render $SITE_NAME $COMPOSITION_ID --region=$REGION"
fi

eval "$RENDER_CMD" 2>&1 | tee -a "$LOG_FILE"

# ── Buoc 3: Bao cao ──────────────────────────────────────────
echo ""
echo "=============================================="
echo "✅ [3/3] Render xong!"
echo "📄 Log luu tai: $LOG_FILE"
echo "🎥 Video da luu tren S3 — xem output phia tren de lay URL"
echo "⏱  Hoan thanh luc: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=============================================="

# ── Optional: Tu dong tat VM ─────────────────────────────────
if [ "$AUTO_STOP" = "true" ]; then
  echo ""
  echo "💤 AUTO_STOP=true — Tat EC2 sau 60 giay..."
  sleep 60
  sudo shutdown -h now
fi
