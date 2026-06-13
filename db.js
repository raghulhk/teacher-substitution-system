const Database = require("better-sqlite3");

const db = new Database("teacher_substitution.db");

console.log("SQLite database connected");

module.exports = db;