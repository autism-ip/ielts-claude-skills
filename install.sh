#!/usr/bin/env bash
set -euo pipefail

VERSION="3.0.0-alpha"
SKILLS_DIR="${SKILLS_DIR:-$HOME/.claude/skills}"
REPO="autism-ip/ielts-claude-skills"
BRANCH="main"

echo "==> IELTS Claude Skills v${VERSION} Installer"

if ! command -v pnpm &>/dev/null && ! command -v npm &>/dev/null; then
  echo "Error: pnpm or npm required."; exit 1
fi
PM="pnpm"; command -v pnpm &>/dev/null || PM="npm"

TMP_DIR=$(mktemp -d)
trap "rm -rf $TMP_DIR" EXIT

git clone --depth 1 --branch "$BRANCH" "https://github.com/${REPO}.git" "$TMP_DIR" 2>/dev/null

mkdir -p "$SKILLS_DIR"
for skill in ielts ielts-writing ielts-reading ielts-speaking ielts-listening ielts-vocab ielts-diagnose ielts-dashboard; do
  [ -d "$TMP_DIR/skills/$skill" ] && cp -r "$TMP_DIR/skills/$skill" "$SKILLS_DIR/" && echo "  ✓ $skill"
done

cd "$TMP_DIR"
$PM install --frozen-lockfile 2>/dev/null || $PM install 2>/dev/null
$PM link --global 2>/dev/null && echo "  ✓ ielts CLI"

echo "==> Done! Restart Claude Code and type /ielts."
