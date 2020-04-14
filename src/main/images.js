import { app } from "electron";
import path from "path";
import fs from "fs";
import shortid from "shortid";
import axios from "axios";

const fsPromises = fs.promises;

const imagesFolder = path.join(app.getPath("userData"), "images");

if (!fs.existsSync(imagesFolder)) {
  fs.mkdirSync(imagesFolder);
}

function getExtension(contentType) {
  switch (contentType) {
    case "image/jpeg":
      return "jpeg";
    case "image/jpg":
      return "jpg";
    case "image/png":
      return "png";
  }
}

export const addRemoteFile = async (url) => {
  const id = shortid();

  const response = await axios.get(url, { responseType: "arraybuffer" });

  const ext = getExtension(response.headers["content-type"]);
  const fileName = `${id}.${ext}`;

  const filePath = path.join(imagesFolder, fileName);
  await fsPromises.writeFile(filePath, response.data);

  return { id, filePath, fileName };
};

export const addLocalFile = async (file) => {
  const id = shortid();

  const data = await fsPromises.readFile(file.path);

  const fileName = id + file.name;
  const filePath = path.join(imagesFolder, fileName);
  await fsPromises.writeFile(filePath, data);

  return { id, filePath, fileName: fileName };
};

export const get = async (fileName) => {
  return fsPromises.readFile(path.join(imagesFolder, fileName));
};

export const remove = async (fileName) => {
  try {
    await fsPromises.unlink(path.join(imagesFolder, fileName));
  } catch (e) {
    console.error(e);
  }
};
