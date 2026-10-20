// Thin desktop shell: loads your Open Founder server (self-hosted or cloud).
const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs'); const path = require('path');
const cfgFile = () => path.join(app.getPath('userData'), 'config.json');
const readCfg = () => { try { return JSON.parse(fs.readFileSync(cfgFile(), 'utf8')); } catch { return { serverUrl: 'http://localhost:3000' }; } };
async function open(win) {
  const { serverUrl } = readCfg();
  try { const r = await fetch(serverUrl, { method: 'HEAD' }); if (r.status < 500) return win.loadURL(serverUrl); } catch {}
  win.loadFile('setup.html', { query: { url: serverUrl } });
}
app.whenReady().then(() => {
  const win = new BrowserWindow({ width: 1280, height: 820, backgroundColor: '#0b0614', webPreferences: { contextIsolation: true, preload: undefined } });
  win.webContents.on('will-navigate', (e, url) => {
    if (url.startsWith('openfounder://set?')) { e.preventDefault(); const u = new URL(url).searchParams.get('url');
      fs.mkdirSync(path.dirname(cfgFile()), { recursive: true }); fs.writeFileSync(cfgFile(), JSON.stringify({ serverUrl: u })); open(win); }
  });
  open(win);
});
app.on('window-all-closed', () => app.quit());
