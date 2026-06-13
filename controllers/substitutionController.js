const db = require("../db");

exports.assignSubstitute = (req, res) => {
  try {
    const { absent_teacher_id, date, day, period } = req.body;

    if (!absent_teacher_id || !date || !day || !period) {
      return res.status(400).json({
        message: "absent_teacher_id, date, day, and period are required",
      });
    }

    const absentClass = db.prepare(`
      SELECT * FROM timetable
      WHERE teacher_id = ? AND day = ? AND period = ?
    `).get(absent_teacher_id, day, period);

    if (!absentClass) {
      return res.status(404).json({
        message: "No timetable found for absent teacher in this period",
      });
    }

    const freeTeacher = db.prepare(`
      SELECT * FROM teachers
      WHERE id != ?
      AND id NOT IN (
        SELECT teacher_id FROM timetable
        WHERE day = ? AND period = ?
      )
      LIMIT 1
    `).get(absent_teacher_id, day, period);

    if (!freeTeacher) {
      return res.status(404).json({
        message: "No free teacher available for this period",
      });
    }

    const result = db.prepare(`
      INSERT INTO substitutions
      (absent_teacher_id, substitute_teacher_id, date, day, period, class_name)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      absent_teacher_id,
      freeTeacher.id,
      date,
      day,
      period,
      absentClass.class_name
    );

    res.status(201).json({
      message: "Substitute assigned successfully",
      substitutionId: result.lastInsertRowid,
      absent_teacher_id,
      substitute_teacher: freeTeacher.name,
      class_name: absentClass.class_name,
      day,
      period,
      date,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to assign substitute" });
  }
};

exports.getSubstitutions = (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT
        substitutions.*,
        absent.name AS absent_teacher_name,
        substitute.name AS substitute_teacher_name
      FROM substitutions
      JOIN teachers AS absent
        ON substitutions.absent_teacher_id = absent.id
      JOIN teachers AS substitute
        ON substitutions.substitute_teacher_id = substitute.id
      ORDER BY substitutions.id DESC
    `).all();

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch substitutions",
    });
  }
};

exports.deleteSubstitution = (req, res) => {
  try {
    const { id } = req.params;

    db.prepare("DELETE FROM substitutions WHERE id = ?").run(id);

    res.json({
      message: "Substitution deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to delete substitution",
    });
  }
};