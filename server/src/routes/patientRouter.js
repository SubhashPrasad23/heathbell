const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth");

const {
  addPatient,
  getAllPatient,
  editPatient,
  deletePatient,
} = require("../controllers/patient");

router.post("/:userId/addPatient", userAuth, addPatient);
router.get("/:userId/getAllPatient", userAuth, getAllPatient);
router.post("/:userId/:patientId/editPatient", userAuth, editPatient);
router.post("/:userId/:patientId/deletePatient", userAuth, deletePatient);

module.exports = router;
