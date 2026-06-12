const bcrypt = require("bcryptjs");
const db = require("./db");

const username = "admin";
const password = "admin123";

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error("Hash error:", err.message);
    return;
  }

  db.run(
    "INSERT OR IGNORE INTO admins (username, password) VALUES (?, ?)",
    [username, hash],
    function (err) {
      if (err) {
        console.error("Admin creation failed:", err.message);
      } else {
        console.log("Admin created successfully");
        console.log("Username: admin");
        console.log("Password: admin123");
      }

      db.close();
    }
  );
});