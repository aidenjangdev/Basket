const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    vibrancy: 'fullscreen-ui',
    backgroundMaterial: 'acrylic',
    titleBarStyle: 'hidden',
    transparent: true,
    visualEffectState: 'active',
  })
  win.setMenu(null)
  win.loadFile('app/main/index.html')
}

app.whenReady().then(() => {
  createWindow()
})