const express = require("express");
const router = express.Router();

const {
  addTimetable,
  getTimetable,
} = require("../controllers/timetableController");


const authMiddleware =
require("../middleware/authMiddleware");

router.post(
  "/",
  authMiddleware,
  addTimetable
);
router.get("/", getTimetable);

module.exports = router;