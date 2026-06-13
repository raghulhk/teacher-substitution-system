const db = require("../db");

exports.addTimetable = (req, res) => {
  try {
    const { teacher_id, day, period, class_name, subject } = req.body;

    const result = db.prepare(`
      INSERT INTO timetable
      (teacher_id, day, period, class_name, subject)
      VALUES (?, ?, ?, ?, ?)
    `).run(teacher_id, day, period, class_name, subject);

    res.status(201).json({
      message: "Timetable added successfully",
      timetableId: result.lastInsertRowid,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to add timetable",
      error: err.message,
    });
  }
};

exports.getTimetable = (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT
        timetable.*,
        teachers.name AS teacher_name
      FROM timetable
      JOIN teachers
      ON timetable.teacher_id = teachers.id
      ORDER BY timetable.id DESC
    `).all();

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch timetable",
    });
  }
};

exports.deleteTimetable = (req, res) => {
  try {
    const { id } = req.params;

    db.prepare("DELETE FROM timetable WHERE id = ?").run(id);

    res.json({
      message: "Timetable deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to delete timetable",
    });
  }
};