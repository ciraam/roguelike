const { app, BrowserWindow, ipcMain, Notification  } = require('electron/main');
const path = require('node:path');
const fs = require('fs');
const bdd = require('./database.js');
const icon = path.join(__dirname, 'img/icon.ico');
let win;
let inGame = false;
let isPause;

// app.disableHardwareAcceleration();
app.name = "roguelike project";

const createWindow = () => {
  win = new BrowserWindow({
    icon: icon,
    width: 600,
    height: 700,
    titleBarStyle: 'hidden',
    ...(process.platform !== 'darwin' ? { titleBarOverlay: true } : {}),
    // webgl: true,
    nodeIntegration: true,
    contextIsolation: false,
    enableRemoteModule: true,
    webPreferences: { preload: path.join(__dirname, 'preload.js') }
  });
  win.webContents.setFrameRate(75);
  win.resizable = false;
  win.setBackgroundColor('rgba(61, 61, 61, 0.5)');
  win.loadFile('index.html');
  // win.webContents.openDevTools();
}

// envoyer une notification bureau
function sendNotification(title, content) {
  new Notification({ title: title, body: content, icon: icon, silent: true }).show();
}

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
  // id = null;
  // bdd.dbEnd();
});

ipcMain.on('inGame', (event, gameState) => {
  inGame = gameState;
});

ipcMain.on('pause', (event, pauseState) => {
    isPause = pauseState;
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
  // id = null;
  app.quit();
  // bdd.dbEnd();
});

// vérifie si l'user a déjà lancé l'app
const filePath = path.join('DONTTOUCH.txt');
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
  if (user_pseudo != undefined) {
    bdd.addUser(user_pseudo);
    bdd.getUserByPseudo(user_pseudo, (err, user) => {
      if (!err) {
        fs.writeFileSync(filePath, user.user_id.toString());
      } else {
        sendNotification('Erreur', 'Aucun utilisateur avec ce pseudo');
      }
  });
  }
});

ipcMain.on('getLastGame', (event, userData) => {
  const { user_id, user_last_game } = userData;
  bdd.getLastGame(user_id, user_last_game, (err, score) => {
    if (!err) {
      event.reply('lastGame', score);
    }
  });
});

ipcMain.on('getUsers', (event) => {
  bdd.getUsers((err, users) => {
    if (!err) {
      event.reply('users', users);
    }
  });
});

ipcMain.on('getUserById', (event, user_id) => {
  bdd.getUserById(user_id, (err, user) => {
    if (!err) {
      event.reply('userById', user);
    }
  });
});

ipcMain.on('getUserByPseudo', (event, user_pseudo) => {
  bdd.getUserByPseudo(user_pseudo, (err, user) => {
    if (!err) {
      event.reply('userByPseudo', user);
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

ipcMain.on('addUserScore', (event, userData) => {
  const { user_id, user_bestscore, user_count_death, user_last_game  } = userData;
  console.log("Données reçues dans le main process:", userData);
  if (user_id !== undefined && user_bestscore !== undefined && user_count_death !== undefined && user_last_game !== undefined) {
    bdd.addUserScore(user_id, user_bestscore, user_count_death, user_last_game);
  }
});

ipcMain.on('getScores', (event) => {
  bdd.getScores((err, scores) => {
    if (!err) {
      event.reply('scores', scores);
    }
  });
});

ipcMain.on('getScoreById', (event, score_user_id) => {
  bdd.getScoreById(score_user_id, (err, scoresById) => {
    if (!err) {
      event.reply('scoresById', scoresById);
    }
  });
});