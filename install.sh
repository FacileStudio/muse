#!/usr/bin/env bash
set -euo pipefail

REPO="https://github.com/FacileStudio/muse.git"
MARKER_START="<!-- muse:start -->"
MARKER_END="<!-- muse:end -->"
INSTALLED=0

# ── shared clone / update ────────────────────────────────────────────────────

clone_or_update() {
  local dest="$1"
  if [ -d "$dest/.git" ]; then
    echo "  Updating existing clone..."
    git -C "$dest" pull --ff-only
  else
    echo "  Cloning repo..."
    mkdir -p "$dest"
    git clone --depth=1 "$REPO" "$dest"
  fi
}

# ── inject / replace a marked block in a file ────────────────────────────────
# Usage: inject_block <file> <content>
# Appends a new block or replaces the existing marked block. Never touches
# content outside the markers.

inject_block() {
  local file="$1"
  local content="$2"
  local block
  block="$(printf '%s\n%s\n%s' "$MARKER_START" "$content" "$MARKER_END")"

  if [ ! -f "$file" ]; then
    printf '%s\n' "$block" > "$file"
    return
  fi

  if grep -qF "$MARKER_START" "$file"; then
    # Replace existing block (portable: no sed -i on all platforms)
    local tmp
    tmp="$(mktemp)"
    awk -v start="$MARKER_START" -v end="$MARKER_END" -v block="$block" '
      $0 == start { print block; skip=1; next }
      $0 == end   { skip=0; next }
      !skip       { print }
    ' "$file" > "$tmp"
    mv "$tmp" "$file"
  else
    printf '\n%s\n' "$block" >> "$file"
  fi
}

# ── Claude Code ──────────────────────────────────────────────────────────────

install_claude() {
  local skill_dir="$HOME/.claude/skills/muse"
  clone_or_update "$skill_dir/lib"
  # Claude Code skills are isolated files — safe to overwrite directly
  cp "$skill_dir/lib/integrations/MUSE.md" "$skill_dir/SKILL.md"
  echo "  ✓ Claude Code → $skill_dir/SKILL.md"
  INSTALLED=1
}

# ── Codex ────────────────────────────────────────────────────────────────────

install_codex() {
  local lib_dir="$HOME/.codex/muse/lib"
  local agents_file="$HOME/.codex/AGENTS.md"
  clone_or_update "$lib_dir"
  mkdir -p "$HOME/.codex"
  inject_block "$agents_file" "$(cat "$lib_dir/integrations/MUSE.md")"
  echo "  ✓ Codex → $agents_file (block injected)"
  INSTALLED=1
}

# ── detect and install ───────────────────────────────────────────────────────

echo "Installing muse..."
echo ""

command -v claude &>/dev/null && install_claude
command -v codex  &>/dev/null && install_codex

if [ "$INSTALLED" -eq 0 ]; then
  echo "  No supported AI tool found in PATH (claude, codex)."
  echo "  Install one, then re-run:"
  echo "    curl -fsSL https://raw.githubusercontent.com/FacileStudio/muse/main/install.sh | bash"
  exit 1
fi

echo ""
echo "Update anytime: curl -fsSL https://raw.githubusercontent.com/FacileStudio/muse/main/install.sh | bash"
