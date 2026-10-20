#!/usr/bin/env sh
# Open Founder one-line self-host installer.
# curl -fsSL https://codesbyfebin.github.io/Open-Founder/install.sh | sh
set -eu
REPO="https://github.com/CodesbyFebin/Open-Founder.git"
DIR="${OPEN_FOUNDER_DIR:-$HOME/open-founder}"
BRANCH="${OPEN_FOUNDER_BRANCH:-open-founder-monorepo}"
need() { command -v "$1" >/dev/null 2>&1 || { echo "Error: '$1' is required. Install it and re-run." >&2; exit 1; }; }
need git; need docker
docker compose version >/dev/null 2>&1 || { echo "Error: Docker Compose v2 plugin is required." >&2; exit 1; }
if [ -d "$DIR/.git" ]; then echo "Updating $DIR"; git -C "$DIR" pull --ff-only
else echo "Cloning into $DIR"; git clone --depth 1 -b "$BRANCH" "$REPO" "$DIR" || git clone --depth 1 "$REPO" "$DIR"; fi
cd "$DIR"
if [ ! -f .env ]; then
  cp .env.example .env
  PW=$(LC_ALL=C tr -dc 'A-Za-z0-9' </dev/urandom | head -c 24)
  sed -i.bak "s/change-me/$PW/g" .env && rm -f .env.bak
  echo "Created .env with a random database password. Edit it to add UPI/WhatsApp/AI keys."
fi
case "${1:-up}" in
  up) docker compose up -d --build; echo "Open Founder is starting at http://localhost:3000";;
  down) docker compose down;;
  logs) docker compose logs -f;;
  update) git pull --ff-only && docker compose up -d --build;;
  *) echo "usage: install.sh [up|down|logs|update]"; exit 1;;
esac
