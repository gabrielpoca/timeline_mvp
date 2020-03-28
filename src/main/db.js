import { app } from "electron";
import fs from "fs";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

let filePath = `${app.getPath("userData")}/.timeline.json`;

if (process.env.NODE_ENV !== "production") {
  filePath = `${app.getPath("userData")}/.timeline.dev.json`;
}

if (!fs.existsSync(filePath)) {
  fs.closeSync(fs.openSync(filePath, "w"));
}

const adapter = new FileSync(filePath);
const db = low(adapter);

db.defaults({ entries: [] }).write();

export default db;
