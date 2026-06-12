const db = require("../db");

exports.addTimetable = (req, res) => {
  const { teacher_id, day, period, class_name, subject } = req.body;

  const sql = `
    INSERT INTO timetable
    (teacher_id, day, period, class_name, subject)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [teacher_id, day, period, class_name, subject],
    function (err) {
      if (err) {
        return res.status(500).json({
          message: "Failed to add timetable",
          error: err.message,
        });
      }

      res.status(201).json({
        message: "Timetable added successfully",
        timetableId: this.lastID,
      });
    }
  );
};

exports.getTimetable = (req, res) => {
  const sql = `
    SELECT
      timetable.*,
      teachers.name AS teacher_name
    FROM timetable
    JOIN teachers
    ON timetable.teacher_id = teachers.id
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch timetable",
      });
    }

    res.json(rows);
  });
};