const db = require("../db");

exports.addTeacher = (req, res) => {
  try {
    const { name, department, subject, email, phone } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Teacher name is required" });
    }

    const result = db.prepare(`
      INSERT INTO teachers (name, department, subject, email, phone)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, department, subject, email, phone);

    res.status(201).json({
      message: "Teacher added successfully",
      teacherId: result.lastInsertRowid,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add teacher" });
  }
};

exports.getTeachers = (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM teachers ORDER BY id DESC").all();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
};

exports.updateTeacher = (req, res) => {
  try {
    const { id } = req.params;
    const { name, department, subject, email, phone } = req.body;

    db.prepare(`
      UPDATE teachers
      SET name = ?, department = ?, subject = ?, email = ?, phone = ?
      WHERE id = ?
    `).run(name, department, subject, email, phone, id);

    res.json({ message: "Teacher updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update teacher" });
  }
};


exports.deleteTeacher = (req, res) => {
  try {
    const { id } = req.params;

    db.prepare(`
      DELETE FROM substitutions
      WHERE absent_teacher_id = ? OR substitute_teacher_id = ?
    `).run(id, id);

    db.prepare(`
      DELETE FROM timetable
      WHERE teacher_id = ?
    `).run(id);

    db.prepare(`
      DELETE FROM teachers
      WHERE id = ?
    `).run(id);

    res.json({
      message: "Teacher deleted successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to delete teacher"
    });
  }
};