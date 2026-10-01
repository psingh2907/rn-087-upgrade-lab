#!/usr/bin/env bash
# Measures Metro on this app, so 0.86 and 0.87 can be compared on the same
# machine with the same commands. Results go to metrics/<version>-<entry>-<time>.txt.
#
# 1. Production bundle + source map (cold cache), 3 runs per platform:
#    wall time and peak memory of the whole CLI process.
# 2. Dev server: time to serve the source map that React Native DevTools
#    loads (index.map), after the bundle is warm, 5 requests, plus the
#    server's peak memory.
set -euo pipefail
cd "$(dirname "$0")/.."
RN=$(node -p "require('react-native/package.json').version")
# ENTRY=index.large ./scripts/measure-metro.sh measures the synthetic large app.
ENTRY=${ENTRY:-index}
OUT=metrics/$RN-${ENTRY}-$(date +%H%M%S).txt
mkdir -p metrics /tmp/rnlab
echo "React Native $RN · entry $ENTRY · $(node -v) · $(sysctl -n machdep.cpu.brand_string) · $(date -u +%FT%TZ)" > "$OUT"

for platform in android ios; do
  for run in 1 2 3; do
    /usr/bin/time -l npx react-native bundle --platform $platform --dev false --entry-file $ENTRY.js \
      --bundle-output /tmp/rnlab/$platform.js --sourcemap-output /tmp/rnlab/$platform.map --reset-cache \
      > /dev/null 2> /tmp/rnlab/time.txt
    real=$(awk '/real/ {print $1; exit}' /tmp/rnlab/time.txt)
    rss=$(awk '/maximum resident set size/ {printf "%.0f", $1/1048576}' /tmp/rnlab/time.txt)
    echo "bundle $platform run$run: ${real}s, peak ${rss}MB" | tee -a "$OUT"
  done
done

PORT=8099
npx react-native start --port $PORT --reset-cache > /tmp/rnlab/server.log 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null || true' EXIT
until curl -s "localhost:$PORT/status" | grep -q running; do sleep 1; done
URL="localhost:$PORT/$ENTRY.bundle?platform=ios&dev=true&minify=false"
curl -s -o /dev/null -w "dev bundle (cold): %{time_total}s\n" "$URL" | tee -a "$OUT"
for run in 1 2 3 4 5; do
  curl -s -o /tmp/rnlab/dev.map -w "dev source map run$run: %{time_total}s\n" \
    "localhost:$PORT/$ENTRY.map?platform=ios&dev=true&minify=false" | tee -a "$OUT"
done
echo "dev source map size: $(wc -c < /tmp/rnlab/dev.map | awk '{printf "%.1f", $1/1048576}')MB" | tee -a "$OUT"
# Peak memory of the Metro node process (it runs as a child of npx).
PIDS=$(pgrep -P $SERVER || true); PIDS="$PIDS $(for p in $PIDS; do pgrep -P $p; done)"
for p in $PIDS; do ps -o rss=,command= -p $p; done | awk '/node/ {m=($1>m)?$1:m} END {printf "dev server memory now: %.0fMB\n", m/1024}' | tee -a "$OUT"
