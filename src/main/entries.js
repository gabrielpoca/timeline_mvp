import { ipcMain } from "electron";
import axios from "axios";
import shortid from "shortid";
import { JSDOM } from "jsdom";

import db from "./db";
import * as images from "./images";

export const update = async entry => {
  return db
    .get("entries")
    .find({ id: entry.id })
    .assign(entry)
    .write();
};

export const add = async ({ content }) => {
  if (content.startsWith("read:http")) {
    return addRead(content.replace("read:", ""));
  } else if (content.startsWith("link:http")) {
    return addLink(content.replace("link:", ""));
  } else if (
    content.startsWith("img:http") ||
    content.endsWith(".jpg") ||
    content.endsWith(".png")
  ) {
    return addImage(content.replace("img:", ""));
  } else if (content.startsWith("http")) {
    return addLink(content);
  } else {
    return addNote({ content });
  }
};

export const remove = async id => {
  const entry = db
    .get("entries")
    .find({ id: id })
    .value();

  if (entry.type === "img") {
    await images.remove(entry.fileName);
  }

  return db
    .get("entries")
    .remove({ id })
    .write();
};

export const loadAll = () => {
  return db.get("entries").value();
};

ipcMain.on("loadAll", event => {
  const entries = db.get("entries").value();
  event.sender.send("loadAll", entries);
});

const addImage = async url => {
  const { id, filePath, fileName } = await images.add(url);
  db.get("entries")
    .push({ type: "img", id, fileName, filePath, createdAt: new Date() })
    .write();
};

const addLink = async url => {
  db.get("entries")
    .push({ type: "link", id: shortid.generate(), url, createdAt: new Date() })
    .write();
};

const addNote = async ({ content }) => {
  db.get("entries")
    .push({
      type: "note",
      id: shortid.generate(),
      content,
      createdAt: new Date()
    })
    .write();
};

const addRead = async url => {
  const response = await axios.get(url);
  const dom = new JSDOM(response.data);
  const author = dom.window.document.querySelector('meta[name="author"]')
    ? dom.window.document.querySelector('meta[name="author"]').content
    : null;
  return db
    .get("entries")
    .push({
      url,
      content: response.data,
      id: shortid.generate(),
      title: dom.window.document.title,
      author,
      type: "read",
      createdAt: new Date()
    })
    .write();
};
