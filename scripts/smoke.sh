#!/bin/sh
#
# Consumer contract harness.
#
# The demo cannot catch consumer bugs, by construction: it aliases @facile/muse straight at
# ../src/lib/index.ts, it is a plain Vite SPA rather than SvelteKit, and it is client-only.
# So it never exercises the exports map, the dependency optimizer, SSR, or a real
# node_modules layout. Six of the seven defects found on the first day of real adoption were
# invisible to it.
#
# This installs the *packed* package into a SvelteKit app and asserts the things that broke.
# Every assertion below maps to a defect that shipped — do not relax one without knowing
# which regression you are re-opening.

set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
SMOKE="$ROOT/smoke"
TARBALL="$ROOT/muse-smoke.tgz"
DEV_PORT=5187
SSR_PORT=5188

DEV_PID=''
SSR_PID=''
DEV_LOG=$(mktemp)
SSR_LOG=$(mktemp)

# Killing the recorded PID is not enough and this was wrong once: the PID belongs to the
# subshell, while vite and the adapter-node server run as its *children* and outlive it. A
# "passing" run then left both ports held and the next run failed on its own guard. So the
# port is what gets freed — and that is safe precisely because the guard below refuses to
# start when either port is already busy, so anything listening at cleanup time is ours.
free_port() {
    _pids=$(lsof -ti "tcp:$1" 2>/dev/null || true)
    [ -n "$_pids" ] && kill $_pids 2>/dev/null || true
}

cleanup() {
    [ -n "$DEV_PID" ] && kill "$DEV_PID" 2>/dev/null || true
    [ -n "$SSR_PID" ] && kill "$SSR_PID" 2>/dev/null || true
    free_port "$DEV_PORT"
    free_port "$SSR_PORT"
    rm -f "$DEV_LOG" "$SSR_LOG"
}
trap cleanup EXIT INT TERM

fail() {
    echo ''
    echo "SMOKE FAILED: $1"
    shift
    [ $# -gt 0 ] && echo '' && echo "$@"
    exit 1
}

step() { echo "▸ $1"; }

# Wait for a port to answer, but give up early if the process is already dead — otherwise a
# server that exits on startup costs the full timeout and reports as "slow" instead of
# "broken", which is exactly how the dev-optimizer bug hid.
wait_for_http() {
    _url=$1
    _pid=$2
    _log=$3
    _what=$4
    _tries=0
    while [ "$_tries" -lt 120 ]; do
        if ! kill -0 "$_pid" 2>/dev/null; then
            fail "$_what exited before serving a request" "$(cat "$_log")"
        fi
        if curl -fsS -o /dev/null "$_url" 2>/dev/null; then
            return 0
        fi
        _tries=$((_tries + 1))
        sleep 0.5
    done
    fail "$_what never answered $_url within 60s" "$(cat "$_log")"
}

# A port held by a previous run would let the harness curl the wrong server and pass. Refuse
# to start rather than report a result about something we did not launch.
require_free_port() {
    if lsof -ti "tcp:$1" >/dev/null 2>&1; then
        fail "port $1 is already in use — a stale server would fake a pass" \
            "$(lsof -i "tcp:$1" | head -3)"
    fi
}

require_free_port "$DEV_PORT"
require_free_port "$SSR_PORT"

# ---------------------------------------------------------------- 1. pack and clean install
step 'Packing the library'
rm -f "$TARBALL"
# `--filename` and `--destination` are mutually exclusive in bun 1.3, so the filename is
# stable and the working directory is what places it.
(cd "$ROOT" && bun pm pack --quiet --filename muse-smoke.tgz >/dev/null)
[ -f "$TARBALL" ] || fail 'bun pm pack produced no tarball at' "$TARBALL"

step 'Installing the tarball into smoke/ (clean)'
# Both removals matter: bun will happily serve a cached extraction of a same-named tarball,
# and then the harness tests the previous build of the library rather than this one.
rm -rf "$SMOKE/node_modules/@facile/muse" "$SMOKE/bun.lock" "$SMOKE/.svelte-kit" "$SMOKE/build"
(cd "$SMOKE" && bun install --silent) || fail 'bun install failed in smoke/'

[ -f "$SMOKE/node_modules/@facile/muse/src/lib/index.ts" ] ||
    fail 'the installed package has no src/lib/index.ts — check the `files` field'
[ -f "$SMOKE/node_modules/@facile/muse/src/lib/styles/tokens.css" ] ||
    fail 'the installed package has no styles/tokens.css — check the `files` field'

# ------------------------------------------------------------------------- 2. dev server up
# The assertion that catches the dependency-optimizer class of bug. `vite build` never runs
# the optimizer, so this is the only gate that sees it.
# `bun --bun` forces bun's own runtime instead of whatever `node` happens to be on PATH.
# That is not a dodge: bun is the suite's declared runtime, so this is what a Facile app
# actually runs. It also removes a whole class of false failure — an ambient Node 20.11
# made vite die on `styleText from node:util`, which says nothing about the library.
# `--strictPort` matters more than it looks: without it vite silently walks to the next free
# port when one is taken, and the harness would then curl a *stale server from a previous
# run* and pass.
step 'Starting vite dev'
(cd "$SMOKE" && bun --bun run dev --port "$DEV_PORT" --strictPort >"$DEV_LOG" 2>&1) &
DEV_PID=$!
wait_for_http "http://127.0.0.1:$DEV_PORT/" "$DEV_PID" "$DEV_LOG" 'the dev server'

DEV_STATUS=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$DEV_PORT/")
[ "$DEV_STATUS" = '200' ] || fail "dev server answered $DEV_STATUS, expected 200" "$(cat "$DEV_LOG")"

kill "$DEV_PID" 2>/dev/null || true
wait "$DEV_PID" 2>/dev/null || true
free_port "$DEV_PORT"
DEV_PID=''

# ------------------------------------------------------------------------------- 3. it builds
step 'Building'
(cd "$SMOKE" && bun --bun run build >"$SSR_LOG" 2>&1) || fail 'vite build failed' "$(cat "$SSR_LOG")"

# --------------------------------------------------------------------------- 4. SSR renders
# A 200 is not a pass on its own — SvelteKit serves its error page with a status too. Assert
# markup that only a rendered muse component produces.
step 'Server-rendering through adapter-node'
(cd "$SMOKE" && PORT="$SSR_PORT" HOST=127.0.0.1 bun build/index.js >"$SSR_LOG" 2>&1) &
SSR_PID=$!
wait_for_http "http://127.0.0.1:$SSR_PORT/" "$SSR_PID" "$SSR_LOG" 'the SSR server'

HTML=$(curl -s "http://127.0.0.1:$SSR_PORT/")
SSR_STATUS=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$SSR_PORT/")
[ "$SSR_STATUS" = '200' ] || fail "SSR answered $SSR_STATUS, expected 200" "$(cat "$SSR_LOG")"

for marker in 'data-smoke="ready"' 'bg-fc-component' 'rounded-fc-pill' '<table'; do
    case "$HTML" in
        *"$marker"*) ;;
        *) fail "the server-rendered HTML is missing '$marker' — the page returned 200 but did not render" \
            "$(printf '%s' "$HTML" | head -c 600)" ;;
    esac
done

kill "$SSR_PID" 2>/dev/null || true
wait "$SSR_PID" 2>/dev/null || true
free_port "$SSR_PORT"
SSR_PID=''

# ----------------------------------------------------------------- 5. the CSS carries the contract
step 'Checking the compiled stylesheet'
CSS=$(find "$SMOKE/build/client/_app/immutable/assets" -name '*.css' 2>/dev/null | head -1)
[ -n "$CSS" ] || fail 'no compiled stylesheet under smoke/build/client/_app/immutable/assets'

# --color-fc-page       the theme block survived the package import
# --color-fc-chart-6    the `@theme static` slot — a plain @theme drops it and SVG fills render black
# color-scheme          the half of dark mode a token cannot reach; needed in BOTH modes
# bg-fc-component       a utility that only exists because @source scanned node_modules
for needle in '--color-fc-page' '--color-fc-chart-6' 'color-scheme:dark' 'color-scheme:light' 'bg-fc-component'; do
    grep -q -- "$needle" "$CSS" || fail "the compiled CSS is missing '$needle'" "stylesheet: $CSS"
done

# muse bundles no face any more (the trial cut it used to ship covered 68 glyphs and no
# accented Latin). If one is reintroduced, restore an emitted-asset assertion here: the
# @font-face url() resolving from node_modules is a real failure mode that only shows in a
# packed install. `src/lib/styles/fonts.test.ts` guards the glyph coverage side of it.
if ls "$SMOKE/build/client/_app/immutable/assets/" 2>/dev/null | grep -qi '\.\(otf\|ttf\|woff2\?\)$'; then
    fail 'a font asset was emitted, but muse ships no face — add back the coverage assertion'
fi

echo ''
echo 'SMOKE PASSED — packed install, dev server, build, SSR render and token contract all green.'
