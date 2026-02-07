const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path');
const https = require('https');
const fs = require('fs');

let mainWindow;
let wizardWindow = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    vibrancy: 'fullscreen-ui',
    backgroundMaterial: 'acrylic',
    titleBarStyle: 'hidden',
    transparent: true,
    visualEffectState: 'active',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.setMenu(null)
  mainWindow.loadFile('app/main/index.html')
}

ipcMain.handle('open-wizard', () => {
  if (wizardWindow && !wizardWindow.isDestroyed()) {
    wizardWindow.focus();
    return;
  }

  wizardWindow = new BrowserWindow({
    width: 700,
    height: 500,
    parent: mainWindow,
    modal: true,
    resizable: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  wizardWindow.loadFile('app/wizard/index.html');

  wizardWindow.on('closed', () => {
    wizardWindow = null;
  });
});

ipcMain.on('close-wizard', () => {
  if (wizardWindow && !wizardWindow.isDestroyed()) {
    wizardWindow.close();
  }
});

ipcMain.handle('get-spigot-versions', async () => {
  return new Promise((resolve, reject) => {
    https.get('https://hub.spigotmc.org/versions/', res => {
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => {
        try {
          const matches = html.match(/\d+\.\d+(?:\.\d+)?\.json/g) || [];
          const versions = [...new Set(
            matches.map(v => v.replace('.json', ''))
          )];
          resolve(versions);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', err => reject(err));
  });
});

ipcMain.handle('create-server', async (event, payload) => {
  try {
    const baseDir = path.join(app.getPath('userData'), 'servers');

    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }

    const existing = fs.readdirSync(baseDir)
      .filter(name => /^\d+$/.test(name))
      .map(n => parseInt(n, 10))
      .sort((a, b) => a - b);

    const nextIndex = existing.length ? existing[existing.length - 1] + 1 : 1;
    const serverDir = path.join(baseDir, String(nextIndex));

    fs.mkdirSync(serverDir);

    const data = [
      `name=${payload.name}`,
      `runner=${payload.runner}`,
      `version=${payload.version}`
    ].join('\n');

    fs.writeFileSync(path.join(serverDir, 'data.txt'), data, 'utf8');

    return { ok: true, id: nextIndex };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

app.whenReady().then(() => {
  createWindow()
})