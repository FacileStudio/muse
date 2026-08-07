#!/usr/bin/env bash
#
# Facile Studio installer. Canonical shape lives in Wiki/CLI-STANDARD.md.
# muse ships no binary, so this registers the AI agent skill only. The message
# vocabulary matches every other Facile installer.
# Every statement sits inside a function and main() is the last line, so a
# download truncated mid-flight executes nothing at all.

set -euo pipefail

NAME="muse"
REPO="FacileStudio/muse"
BRANCH="main"
SKILL="muse"

# --- output -----------------------------------------------------------------

setup_colors() {
  if [ -t 1 ] && [ -z "${NO_COLOR:-}" ] && [ "${TERM:-dumb}" != "dumb" ]; then
    C_INFO=$'\033[36m' C_OK=$'\033[32m' C_WARN=$'\033[33m' C_ERR=$'\033[31m'
    C_DIM=$'\033[2m' C_OFF=$'\033[0m'
  else
    C_INFO="" C_OK="" C_WARN="" C_ERR="" C_DIM="" C_OFF=""
  fi
}

info() { printf '%s▸%s %s\n' "$C_INFO" "$C_OFF" "$*"; }
ok()   { printf '%s✓%s %s\n' "$C_OK" "$C_OFF" "$*"; }
warn() { printf '%s!%s %s\n' "$C_WARN" "$C_OFF" "$*" >&2; }
hint() { printf '  %s%s%s\n' "$C_DIM" "$*" "$C_OFF"; }
die()  { printf '%s✗%s %s\n' "$C_ERR" "$C_OFF" "$*" >&2; exit 1; }

usage() {
  cat <<USAGE
Install the $NAME AI agent skill.

Usage:
  install.sh [options]

Options:
  -h, --help        Show this help

Environment:
  NO_COLOR          Disable colored output
USAGE
}

# --- steps ------------------------------------------------------------------

parse_args() {
  while [ $# -gt 0 ]; do
    case "$1" in
      -h|--help) usage; exit 0 ;;
      *) die "unknown option: $1 — run install.sh --help" ;;
    esac
  done
}

make_workdir() {
  WORK="$(mktemp -d)"
  trap 'rm -rf "$WORK"' EXIT
}

fetch_skill() {
  command -v curl >/dev/null 2>&1 || die "curl not found — install curl first"
  info "Fetching skill"
  curl -fsSL -o "$WORK/SKILL.md" \
    "https://raw.githubusercontent.com/$REPO/$BRANCH/integrations/SKILL.md" ||
    die "cannot download the $NAME skill from $REPO"
  [ -s "$WORK/SKILL.md" ] || die "the downloaded skill is empty"

  curl -fsSL -o "$WORK/CHARTE.md" \
    "https://raw.githubusercontent.com/$REPO/$BRANCH/CHARTE.md" ||
    die "cannot download the $NAME visual contract from $REPO"
  [ -s "$WORK/CHARTE.md" ] || die "the downloaded visual contract is empty"
}

register_skill() {
  INSTALLED=0

  if command -v claude >/dev/null 2>&1; then
    mkdir -p "$HOME/.claude/skills/$SKILL"
    cp "$WORK/SKILL.md" "$HOME/.claude/skills/$SKILL/SKILL.md"
    cp "$WORK/CHARTE.md" "$HOME/.claude/skills/$SKILL/CHARTE.md"
    ok "Claude Code skill installed"
    INSTALLED=1
  fi

  if command -v codex >/dev/null 2>&1; then
    mkdir -p "$HOME/.codex/$SKILL"
    cp "$WORK/CHARTE.md" "$HOME/.codex/$SKILL/CHARTE.md"
    inject_block "$HOME/.codex/AGENTS.md" "$WORK/SKILL.md"
    ok "Codex skill installed"
    INSTALLED=1
  fi
}

inject_block() {
  local file="$1" content="$2" start="<!-- $SKILL:start -->" end="<!-- $SKILL:end -->"
  local tmp
  tmp="$(mktemp)"
  if [ -f "$file" ]; then
    awk -v s="$start" -v e="$end" '
      $0 == s { skip = 1; next }
      $0 == e { skip = 0; next }
      !skip   { print }
    ' "$file" >"$tmp"
    [ -s "$tmp" ] && printf '\n' >>"$tmp"
  fi
  {
    printf '%s\n' "$start"
    cat "$content"
    printf '%s\n' "$end"
  } >>"$tmp"
  mv "$tmp" "$file"
}

report() {
  if [ "$INSTALLED" -eq 0 ]; then
    warn "no supported AI tool found on your PATH (claude, codex)"
    hint "install one, then run this script again"
    exit 1
  fi
  info "Update anytime by running this script again"
}

# --- main -------------------------------------------------------------------

main() {
  # Colours before args: parse_args can die(), and die() dereferences $C_ERR
  # under `set -u`.
  setup_colors
  parse_args "$@"
  info "Installing $NAME"
  make_workdir
  fetch_skill
  register_skill
  report
}

main "$@"
