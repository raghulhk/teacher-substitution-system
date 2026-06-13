const bcrypt = require("bcryptjs");
const db = require("./db");

const username = "admin";
const password = "admin123";

const hash = bcrypt.hashSync(password, 10);

db.prepare(`
  INSERT OR IGNORE INTO admins (username, password)
  VALUES (?, ?)
`).run(username, hash);

console.log("Admin created successfully");
console.log("Username: admin");
console.log("Password: admin123");