"use strict";

import { app, BrowserWindow } from "electron";
import { ipcMain } from "electron";
import axios from "axios";

import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({ entries: [] }).write();

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\");
}

let mainWindow;
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 800,
    useContentSize: true,
    width: 1400
  });

  mainWindow.loadURL(winURL);

  mainWindow.on("closed", () => {
    mainWindow = null;
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

ipcMain.on("add", async (event, url) => {
  try {
    const response = await axios.get(url);
    // const dom = new jsdom.JSDOM(response.data, {
    //   url
    // });
    // const reader = new Readability(doc.window.document);
    // const article = reader.parse();
    // console.log(article);

    // const $ = cheerio.load(response.data);
    // juice.juiceResources(response.data, {}, (err, data) => {
    //   if (err) throw err;
    //   const html = cheerio.load(data)('body').html();
    db.get("entries")
      .push({ url, content: response.data })
      .write();
    loadAll(event);
    // })
  } catch (e) {
    console.error(e);
  }
});

ipcMain.on("loadAll", event => {
  loadAll(event);
});

function loadAll(event) {
  const entries = db.get("entries").value();
  event.sender.send("loadAll", entries);
}

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
