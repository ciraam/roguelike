const { app, BrowserWindow, ipcMain,  Menu, MenuItem, Notification  } = require('electron/main')
const path = require('node:path')

app.disableHardwareAcceleration()

const createWindow = () => {
  const win = new BrowserWindow({
    width: 600,
    height: 700,
    titleBarStyle: 'hidden',
    ...(process.platform !== 'darwin' ? { titleBarOverlay: true } : {}),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.webContents.setFrameRate(60)
  win.resizable = false
  win.setBackgroundColor('rgba(61, 61, 61, 0.5)')
  win.loadFile('index.html')
  
}

// test depuis le process
const NOTIFICATION_TITLE = 'Notification test';
const NOTIFICATION_BODY = 'je test l\'envoie de notification du pc depuis l\'application';
function showNotification() {
  new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
}

const menu = new Menu()
menu.append(new MenuItem({
  // label: 'Electron',
  submenu: [{
    role: 'help',
    accelerator: process.platform === 'darwin' ? 'Space+Cmd' : 'Space+Shift',
    click: () => { showNotification() }
  }]
}))

Menu.setApplicationMenu(menu)

app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong')
    createWindow()
    // pour macOS
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          createWindow()
        }
    })
})

// pour Windows & Linux
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})