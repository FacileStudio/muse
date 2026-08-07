#!/bin/sh
# Cut a muse release: verify, bump, commit, tag, push.
#
# Consumers pin `github:FacileStudio/muse#vX.Y.Z`, so the tag *is* the distribution — there
# is no registry step and nothing to undo once it is pushed. That is exactly why this is a
# script and not a habit: every release before this one was a hand-run sequence, and the one
# time a step was skipped the tag pointed at an unverified tree.
#
#   sh ./scripts/release.sh 0.4.0
#
set -eu

VERSION="${1:-}"

fail() {
    echo "release: $1" >&2
    exit 1
}

[ -n "$VERSION" ] || fail "usage: sh ./scripts/release.sh <version>   (e.g. 0.4.0, no leading v)"
echo "$VERSION" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+$' || fail "version must be plain semver, no leading v: got '$VERSION'"

cd "$(dirname "$0")/.."

# A tag is only worth as much as the tree it points at, so refuse to cut one from a branch
# that is not main or a tree that has anything uncommitted in it.
BRANCH=$(git rev-parse --abbrev-ref HEAD)
[ "$BRANCH" = "main" ] || fail "on branch '$BRANCH' — releases are cut from main"
[ -z "$(git status --porcelain)" ] || fail "working tree is dirty — commit or stash first"

git fetch --quiet origin main
[ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] || fail "HEAD and origin/main disagree — pull or push first"

git rev-parse "v$VERSION" >/dev/null 2>&1 && fail "tag v$VERSION already exists"

CURRENT=$(grep -m1 '"version"' package.json | sed 's/.*"version": "\(.*\)".*/\1/')
[ "$CURRENT" != "$VERSION" ] || fail "package.json is already $VERSION — pick the next version"

echo "release: $CURRENT -> $VERSION"

# Verify before the bump, so a failure leaves the tree exactly as it was found.
echo "release: running the full gate"
mise run verify

# In-place sed is not portable between GNU and BSD, so write through a temp file.
sed "s/\"version\": \"$CURRENT\"/\"version\": \"$VERSION\"/" package.json > package.json.tmp
mv package.json.tmp package.json
grep -q "\"version\": \"$VERSION\"" package.json || fail "version bump did not apply"

git add package.json
git commit -q -m "chore(release): v$VERSION"
git tag -a "v$VERSION" -m "v$VERSION"
git push --quiet origin main --follow-tags

echo "release: v$VERSION pushed"
echo
echo "Consumers upgrade with (bun add cannot re-point a git dep — see docs/development.md):"
echo "    sed -i '' 's|muse#v$CURRENT|muse#v$VERSION|' apps/client/package.json && (cd apps/client && bun install)"
