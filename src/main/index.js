import fs from "fs";
import { app, BrowserWindow, shell } from "electron";
import path from "path";

import * as entries from "./entries";
import * as images from "./images";

const logFile = fs.openSync(`${app.getPath("userData")}/log`, "w");

global.entries = entries;
global.images = images;

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  global.__static = path.join(__dirname, "/static").replace(/\\/g, "\\\\");
}

let mainWindow;
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

function createWindow() {
  mainWindow = new BrowserWindow({
    titleBarStyle: "hidden",
    height: 800,
    useContentSize: true,
    width: process.env.NODE_ENV === "production" ? 900 : 1200,
    enableRemoteModule: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(winURL);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (url.startsWith("http://localhost")) return;
    event.preventDefault();
    shell.openExternal(url);
  });

  mainWindow.webContents.on("new-window", (event, url) => {
    if (url.startsWith("http://localhost")) return;
    event.preventDefault();
    shell.openExternal(url);
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

process.on("uncaughtException", (err, origin) => {
  fs.writeSync(
    logFile,
    `Caught exception: ${err}\n` + `Exception origin: ${origin}`
  );
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
