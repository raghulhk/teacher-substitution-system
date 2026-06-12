const express = require("express");
const router = express.Router();

const {
  assignSubstitute,
  getSubstitutions,
} = require("../controllers/substitutionController");

const authMiddleware =
require("../middleware/authMiddleware");

router.post(
  "/assign",
  authMiddleware,
  assignSubstitute
);
router.get("/", getSubstitutions);

module.exports = router;