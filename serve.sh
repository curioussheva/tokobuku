#!/usr/bin/env bash
# Tokobuku (Medusa v2 + Next.js storefront) - start/stop untuk Termux
# Dijalankan dari mana saja. Data DB di $TMPDIR (prune 24j, SKEMA akan hilang).
# Jika butuh skema persisten: pindahkan PGDATA ke path persistent di bawah ~

set -euo pipefail
PGDATA="$TMPDIR/pgdata"
BACKEND=~/tokobuku/apps/backend
STOREFRONT=~/tokobuku/apps/storefront
WASM_DIR="$HOME/.hermes/cache/scratch/node_modules/@next/swc-wasm-nodejs"
LOGDIR="$HOME/tokobuku/logs"
mkdir -p "$LOGDIR"

start_pg() {
  if ! pg_ctl -D "$PGDATA" status >/dev/null 2>&1; then
    pg_ctl -D "$PGDATA" -l "$TMPDIR/pg.log" \
      -o "-p 5432 -k $TMPDIR -c listen_addresses=localhost -c fsync=off" start
  fi
}

start_backend() {
  cd "$BACKEND"
  nohup ./node_modules/.bin/medusa start > "$LOGDIR/medusa.log" 2>&1 &
}

start_storefront() {
  cd "$STOREFRONT"
  NEXT_TEST_WASM_DIR="$WASM_DIR" NEXT_TELEMETRY_DISABLED=1 \
    nohup ~/node24/bin/node24 ./node_modules/next/dist/bin/next dev -p 8000 \
    > "$LOGDIR/storefront.log" 2>&1 &
}

stop_all() {
  # bunuh CHILD dulu, bukan bash wrapper (wrapper mati tapi child tetap pegang port)
  for pat in '@medusajs/cli/cli.js start' 'next/dist/bin/next' 'postgres -D'; do
    ps -eo pid,cmd | grep -F "$pat" | grep -v grep | awk '{print $1}' | xargs -r kill -9
  done
}

case "${1:-}" in
  start)
    start_pg; sleep 2
    start_backend; echo "backend starting (9000)..."
    sleep 45
    start_storefront; echo "storefront starting (8000)..."
    ;;
  stop) stop_all; echo "all stopped" ;;
  status)
    for p in 9000 8000; do
      code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "http://127.0.0.1:$p" || true)
      echo "port $p: ${code:-down}"
    done
    ;;
  *) echo "usage: $0 {start|stop|status}" ;;
esac
