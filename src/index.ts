import { app, BrowserWindow } from 'electron';

import * as ffmpeg from 'fluent-ffmpeg';
import * as ffprobe_bin from 'ffprobe-static';
import ffmpeg_bin from '@ffmpeg-installer/ffmpeg';
import { DatabaseManager } from './backend/DatabaseManager';
import * as path from 'path';
import { initializeBindings } from './api/contextBridgeBindings';
import { VideoPlayer } from './backend/VideoPlayer';

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

// set the paths of ffprobe and ffmpeg binaries
ffmpeg.setFfmpegPath(ffmpeg_bin.path);
ffmpeg.setFfprobePath(ffprobe_bin.path);

// Configure DatabaseManager
DatabaseManager.setDatabasePath(path.join(app.getPath('appData'), app.getName(), 'db', 'localtube.conf.json'));
DatabaseManager.loadDatabase();

// Configure VideoPlayer class
VideoPlayer.setupMpv();

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 720,
    width: 1280,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    frame: true,
    autoHideMenuBar: true,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  initializeBindings();
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
  DatabaseManager.saveDatabase();
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.