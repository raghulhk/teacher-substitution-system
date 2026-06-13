const express = require("express");
const cors = require("cors");
const path = require("path");

const teacherRoutes = require("../routes/teacherRoutes");
const timetableRoutes = require("../routes/timetableRoutes");
const substitutionRoutes = require("../routes/substitutionRoutes");
const authRoutes = require("../routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/teachers", teacherRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/substitution", substitutionRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Teacher Substitution Assignment System API Running",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});