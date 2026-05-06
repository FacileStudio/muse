#!/usr/bin/env bash
set -euo pipefail

REPO="https://github.com/FacileStudio/muse.git"
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

# ── Claude Code ──────────────────────────────────────────────────────────────

install_claude() {
  local skill_dir="$HOME/.claude/skills/muse"
  clone_or_update "$skill_dir/lib"
  cp "$skill_dir/lib/integrations/MUSE.md" "$skill_dir/SKILL.md"
  echo "  ✓ Claude Code → $skill_dir"
  INSTALLED=1
}

# ── Codex ────────────────────────────────────────────────────────────────────

install_codex() {
  local codex_dir="$HOME/.codex/muse"
  clone_or_update "$codex_dir/lib"
  cp "$codex_dir/lib/integrations/MUSE.md" "$codex_dir/AGENTS.md"
  echo "  ✓ Codex → $codex_dir"
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
