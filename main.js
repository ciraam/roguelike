const { app, BrowserWindow, ipcMain,  Menu, MenuItem, Notification  } = require('electron/main');
const path = require('node:path');
const fs = require('fs');
const bdd = require('./database.js');

app.disableHardwareAcceleration();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 600,
    height: 700,
    titleBarStyle: 'hidden',
    ...(process.platform !== 'darwin' ? { titleBarOverlay: true } : {}),
    nodeIntegration: false,
    contextIsolation: true,
    webPreferences: { preload: path.join(__dirname, 'preload.js') }
  });
  win.webContents.setFrameRate(60);
  win.resizable = false;
  win.setBackgroundColor('rgba(61, 61, 61, 0.5)');
  win.loadFile('index.html');
  win.webContents.openDevTools();
}

// envoyer une notification bureau
function sendNotification(title, content) {
  new Notification({ title: title, body: content }).show();
}

// pour tester les notifs et l'input clavier
// const menu = new Menu();
// menu.append(new MenuItem({
//   label: 'Roguelike',
//   submenu: [{
//     role: 'help',
//     accelerator: process.platform === 'darwin' ? 'Space+Cmd' : 'Space+Shift',
//     click: () => { sendNotification('test input & notif', 'azertyuiopqsdfghjklmwxcvbn'); }
//   }]
// }));
// Menu.setApplicationMenu(menu);

app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong');
  createWindow();
  // pour macOS
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// pour Windows & Linux
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
  mainWindow = null;
  id = null;
  bdd.dbEnd();
});

ipcMain.on('sendNotification', (event, notifData) => {
  const { title, content } = notifData;
  sendNotification(title, content);
});

ipcMain.on('restart', () => {
  app.relaunch();
  app.quit();
});

ipcMain.on('end', () => {
  mainWindow = null;
  id = null;
  app.quit();
  bdd.dbEnd();
});

// vérifie si l'user a déjà lancé l'app
const filePath = path.join(__dirname, 'DONTTOUCH.txt');
ipcMain.handle('fileExists', () => {
  return fs.existsSync(filePath);
});
// permet de lire le fichier quand l'user a déjà lancé l'app
ipcMain.handle('readFile', () => {
  return fs.readFileSync(filePath, 'utf-8');
});
// vérifie si l'user a déjà changé les options
const fileSettingsPath = path.join('settings.txt');
ipcMain.handle('fileSettingsExists', () => {
  return fs.existsSync(fileSettingsPath);
});
// permet de lire le fichier quand l'user a déjà changé les options
ipcMain.handle('readFileSettings', () => {
  let contenu = fs.readFileSync(fileSettingsPath, 'utf-8');
  return contenu;
});
// permet de modifier le fichier "save" contenant le choix de l'user pour les options
ipcMain.on('writeFileSettings', async (event, fileData)=> {
  return fs.writeFileSync(fileSettingsPath, fileData, { flag: 'w' });
});

// côté bdd //

// permet de créer le profil de l'user à son premier lancement de l'app
ipcMain.on('addUser', (event, userData) => {
  const { user_pseudo } = userData;
  console.log("addUser le main process:", user_pseudo);
  if (user_pseudo != undefined) {
    bdd.addUser(user_pseudo);
    // if(bdd.id != null) {
    //   fs.writeFileSync(filePath, bdd.id);
    // }
  } else {
    console.log("addUser invalides reçues dans le main process");
  }
});

ipcMain.on('getScoreById', () => { bdd.getScoreById(bdd.id) });

ipcMain.on('getUserById', () => { bdd.getUserById(bdd.id) });

ipcMain.on('getUsers', (event) => {
  bdd.getUsers((err, users) => {
      if (!err) {
          event.reply('users', users);
      }
  });
});

ipcMain.on('addScore', (event, scoreData) => {
  const { score_user_id, score_level_player, score_level_stage, score_kill, score_time } = scoreData;
  console.log("Données reçues dans le main process:", scoreData);
  if (score_user_id !== undefined && score_level_player !== undefined && score_level_stage !== undefined && score_kill !== undefined && score_time !== undefined) {
    bdd.addScore(score_user_id, score_level_player, score_level_stage, score_kill, score_time);
  }
});