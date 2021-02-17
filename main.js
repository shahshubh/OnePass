const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const ipcMain = require('electron').ipcMain;

let mainWindow = null

app.once('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 700,
    backgroundColor: "#6a6a6a",
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  splash = new BrowserWindow({width: 600, height: 400, transparent: true, frame: false, alwaysOnTop: true});
  splash.loadURL(url.format({
    pathname: path.join(__dirname, '/splash.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.setMenuBarVisibility(false);

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/welcome.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.once('ready-to-show', () => {
      // splash.show();
    setTimeout(function(){
      splash.destroy();
      mainWindow.show();
    }, 4800);
  })
});

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('load-page', (event, arg) => {
  mainWindow.loadURL(arg);
});
