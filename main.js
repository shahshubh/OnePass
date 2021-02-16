const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const ipcMain = require('electron').ipcMain;

let window = null

app.once('ready', () => {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: "#6a6a6a",
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  window.setMenuBarVisibility(false);

  window.loadURL(url.format({
    pathname: path.join(__dirname, '/welcome.html'),
    protocol: 'file:',
    slashes: true
  }))

  window.once('ready-to-show', () => {
      window.show();
  })
});

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('load-page', (event, arg) => {
  window.loadURL(arg);
});
