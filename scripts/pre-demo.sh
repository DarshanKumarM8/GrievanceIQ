#!/bin/bash
# pre-demo.sh — Run 30 minutes before college review
# Usage: ./pre-demo.sh https://your-worker.pages.dev YOUR_ADMIN_KEY

WORKER_URL=${1:-"http://localhost:5173"}
ADMIN_KEY=${2:-"dev-admin-key-change-me"}

echo "🚀 GrievanceIQ Pre-Demo Pipeline Run"
echo "======================================"

# Warm up Render.com container first
echo "⏳ Warming up pipeline backend..."
curl -s "$WORKER_URL/api/health" > /dev/null
sleep 20
echo "   Container warmed up."

# Run each pipeline
for JOB in darpg rss aggregator datagov; do
  echo ""
  echo "▶️  Running $JOB pipeline..."
  RESULT=$(curl -s -X POST "$WORKER_URL/api/admin/pipeline/trigger" \
    -H "Authorization: Bearer $ADMIN_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"job\":\"$JOB\"}")
  echo "   Result: $(echo $RESULT | grep -o '"status":"[^"]*"' | head -1)"
  sleep 5
done

# Verify
echo ""
echo "📊 Verification..."
VERIFY=$(curl -s "$WORKER_URL/api/admin/pipeline/verify" \
  -H "Authorization: Bearer $ADMIN_KEY")
echo "   Ministry data live: $(echo $VERIFY | grep -o '"ministries_live":[0-9]*')"
echo "   Signals today:      $(echo $VERIFY | grep -o '"signals_today":[0-9]*')"
echo "   Trends flagged:     $(echo $VERIFY | grep -o '"trends_live":[0-9]*')"
echo "   Report month:       $(echo $VERIFY | grep -o '"report_month":"[^"]*"')"

echo ""
echo "✅ Ready for demo!"
echo "   Open $WORKER_URL/admin and click 'Start Live Demo' for the judges."
