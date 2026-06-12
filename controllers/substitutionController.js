const db = require("../db");

exports.assignSubstitute = (req, res) => {
  const { absent_teacher_id, date, day, period } = req.body;

  if (!absent_teacher_id || !date || !day || !period) {
    return res.status(400).json({
      message: "absent_teacher_id, date, day, and period are required",
    });
  }

  // Step 1: Find absent teacher's class for that day and period
  const absentClassSql = `
    SELECT * FROM timetable
    WHERE teacher_id = ? AND day = ? AND period = ?
  `;

  db.get(absentClassSql, [absent_teacher_id, day, period], (err, absentClass) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    if (!absentClass) {
      return res.status(404).json({
        message: "No timetable found for absent teacher in this period",
      });
    }

    // Step 2: Find free teacher
    const freeTeacherSql = `
      SELECT * FROM teachers
      WHERE id != ?
      AND id NOT IN (
        SELECT teacher_id FROM timetable
        WHERE day = ? AND period = ?
      )
      LIMIT 1
    `;

    db.get(freeTeacherSql, [absent_teacher_id, day, period], (err, freeTeacher) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      if (!freeTeacher) {
        return res.status(404).json({
          message: "No free teacher available for this period",
        });
      }

      // Step 3: Save substitution
      const insertSql = `
        INSERT INTO substitutions
        (absent_teacher_id, substitute_teacher_id, date, day, period, class_name)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.run(
        insertSql,
        [
          absent_teacher_id,
          freeTeacher.id,
          date,
          day,
          period,
          absentClass.class_name,
        ],
        function (err) {
          if (err) {
            return res.status(500).json({
              message: "Failed to assign substitute",
            });
          }

          res.status(201).json({
            message: "Substitute assigned successfully",
            substitutionId: this.lastID,
            absent_teacher_id,
            substitute_teacher: freeTeacher.name,
            class_name: absentClass.class_name,
            day,
            period,
            date,
          });
        }
      );
    });
  });
};

exports.getSubstitutions = (req, res) => {
  const sql = `
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
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch substitutions",
      });
    }

    res.json(rows);
  });
};