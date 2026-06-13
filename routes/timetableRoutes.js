const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addTimetable,
  getTimetable,
  deleteTimetable,
} = require("../controllers/timetableController");

router.post("/", authMiddleware, addTimetable);
router.get("/", getTimetable);
router.delete("/:id", authMiddleware, deleteTimetable);

module.exports = router;