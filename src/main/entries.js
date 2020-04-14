import { ipcMain } from "electron";
import axios from "axios";
import shortid from "shortid";
import { JSDOM } from "jsdom";
import elasticlunr from "elasticlunr";

import db from "./db";
import * as images from "./images";

const index = elasticlunr(function() {
  this.addField("createdAt");
  this.addField("content");
  this.setRef("id");
  this.saveDocument(false);
});

export const update = async (entry) => {
  return db
    .get("entries")
    .find({ id: entry.id })
    .assign(entry)
    .write();
};

export const add = async ({ content }) => {
  if (content.startsWith("read:http")) {
    return addRead(content.replace("read:", ""));
  } else if (content.startsWith("img:http")) {
    return addImage(content.replace("img:", ""));
  } else {
    return addNote({ content });
  }
};

export const addFile = async (file) => {
  const { id, filePath, fileName } = await images.addLocalFile(file);

  console.log(id, fileName, filePath);
  db.get("entries")
    .push({ type: "img", id, fileName, filePath, createdAt: new Date() })
    .write();
};

export const remove = async (id) => {
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

ipcMain.on("loadAll", (event) => {
  const entries = db.get("entries").value();
  event.sender.send("loadAll", entries);
});

const addImage = async (url) => {
  const { id, filePath, fileName } = await images.addRemoteFile(url);
  db.get("entries")
    .push({ type: "img", id, fileName, filePath, createdAt: new Date() })
    .write();
};

const addNote = async ({ content }) => {
  db.get("entries")
    .push({
      type: "note",
      id: shortid.generate(),
      content,
      createdAt: new Date(),
    })
    .write();
};

const addRead = async (url) => {
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
      createdAt: new Date(),
    })
    .write();
};

loadAll().map((entry) => index.addDoc(entry));

export const search = async (query) => {
  return index.search(query);
};
