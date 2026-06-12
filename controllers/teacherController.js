const db = require("../db");

exports.addTeacher = (req, res) => {
  const { name, department, subject, email, phone } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Teacher name is required" });
  }

  const sql = `
    INSERT INTO teachers (name, department, subject, email, phone)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [name, department, subject, email, phone], function (err) {
    if (err) {
      return res.status(500).json({ message: "Failed to add teacher" });
    }

    res.status(201).json({
      message: "Teacher added successfully",
      teacherId: this.lastID,
    });
  });
};

exports.getTeachers = (req, res) => {
  db.all("SELECT * FROM teachers ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch teachers" });
    }

    res.json(rows);
  });
};
exports.updateTeacher = (req, res) => {
  const { id } = req.params;
  const { name, department, subject, email, phone } = req.body;

  const sql = `
    UPDATE teachers
    SET name = ?, department = ?, subject = ?, email = ?, phone = ?
    WHERE id = ?
  `;

  db.run(sql, [name, department, subject, email, phone, id], function (err) {
    if (err) {
      return res.status(500).json({ message: "Failed to update teacher" });
    }

    res.json({ message: "Teacher updated successfully" });
  });
};

exports.deleteTeacher = (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM teachers WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ message: "Failed to delete teacher" });
    }

    res.json({ message: "Teacher deleted successfully" });
  });
};