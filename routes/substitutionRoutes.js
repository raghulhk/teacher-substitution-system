const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  assignSubstitute,
  getSubstitutions,
  deleteSubstitution,
} = require("../controllers/substitutionController");

router.post("/assign", authMiddleware, assignSubstitute);
router.get("/", getSubstitutions);
router.delete("/:id", authMiddleware, deleteSubstitution);

module.exports = router;