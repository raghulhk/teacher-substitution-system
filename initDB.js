const db = require("./db");

db.exec(`
  CREATE TABLE IF NOT EXISTS teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    department TEXT,
    subject TEXT,
    email TEXT,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS timetable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id INTEGER NOT NULL,
    day TEXT NOT NULL,
    period INTEGER NOT NULL,
    class_name TEXT NOT NULL,
    subject TEXT,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
  );

  CREATE TABLE IF NOT EXISTS substitutions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    absent_teacher_id INTEGER NOT NULL,
    substitute_teacher_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    day TEXT NOT NULL,
    period INTEGER NOT NULL,
    class_name TEXT NOT NULL,
    status TEXT DEFAULT 'Assigned',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (absent_teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (substitute_teacher_id) REFERENCES teachers(id)
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log("Tables created successfully");