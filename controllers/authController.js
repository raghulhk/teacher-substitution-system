const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "teacher_substitution_secret_key";

exports.login = (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const admin = db
      .prepare("SELECT * FROM admins WHERE username = ?")
      .get(username);

    if (!admin) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    bcrypt.compare(password, admin.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: "Password check failed" });
      }

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      const token = jwt.sign(
        { id: admin.id, username: admin.username },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        message: "Login successful",
        token,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};