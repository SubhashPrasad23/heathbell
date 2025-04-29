const express = require("express");
const userAuth = require("../middlewares/userAuth");

const router = express.Router();
const {
  addMedicine,
  editMedicine,
  getAllMedicine,
  deleteMedicine,
} = require("../controllers/medicine");

router.post("/:patientId/addmedicines", userAuth, addMedicine);
router.post("/:patientId/:medicineId/editMedicine", userAuth, editMedicine);
router.get("/:patientId/getAllMedicine", userAuth, getAllMedicine);
router.post("/:patientId/:medicineId/deleteMedicine", userAuth, deleteMedicine);

module.exports = router;
