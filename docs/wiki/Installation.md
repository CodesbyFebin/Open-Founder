# Installation

Desktop and Android builds are **thin clients**. They open the URL of an Open Founder server, so set up a server first ([[Self-hosting with Docker]]).

Downloads: https://codesbyfebin.github.io/Open-Founder/downloads.html (assets from GitHub Releases `latest`).

## One-line CLI (Linux/macOS server)
```bash
curl -fsSL https://codesbyfebin.github.io/Open-Founder/install.sh | sh
# subcommands: sh install.sh up|down|logs|update
```
Needs `git`, Docker and Docker Compose v2. The script clones into `~/open-founder` (override with `OPEN_FOUNDER_DIR`), creates `.env` with a random DB password and runs `docker compose up -d --build`.

## Android (APK)
1. Download `open-founder.apk`.
2. Allow "Install unknown apps" for your browser.
3. Open it and enter your server URL, e.g. `http://192.168.1.10:3000`.

The APK is **debug-signed** and not on the Play Store. To change the server later, reinstall or clear app data.

## Windows (.exe)
Run `OpenFounder-Setup.exe`. The build is unsigned, so SmartScreen may warn: choose **More info → Run anyway**. By default it connects to `http://localhost:3000`. If the server isn't reachable, it asks for a URL.

## Linux (.deb)
```bash
sudo apt install ./open-founder_amd64.deb
```

## Building them yourself
```bash
cd packaging/desktop && npm install && npm run dist:linux   # or dist:win on Windows
cd packaging/android && npm install && npx cap add android && npx cap sync android \
  && cd android && ./gradlew assembleDebug
```
CI: `.github/workflows/release.yml` builds all of these when a `v*` tag is pushed and attaches them to a GitHub Release.
