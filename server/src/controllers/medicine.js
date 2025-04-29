const medicine = require("../models/medicine");
const Medicine = require("../models/medicine");

const addMedicine = async (req, res) => {
  const { patientId } = req.params;
  const {
    name,
    frequency,
    dosage,
    typeofMedicine,
    instructions,
    daysOfWeek,
    times,
    startDate,
    endDate,
    reminderEnabled,
  } = req.body;
  try {
    const newMedicine = new Medicine({
      patientId,
      name,
      frequency,
      dosage,
      typeofMedicine,
      instructions,
      daysOfWeek,
      times,
      startDate,
      endDate,
      reminderEnabled,
    });
    await newMedicine.save();

    res
      .status(200)
      .json({ message: "Medicine added successfully", data: newMedicine });
  } catch (error) {
    console.error(error);
  }
};

const editMedicine = async (req, res) => {
  const { patientId, medicineId } = req.params;

  const {
    name,
    frequency,
    dosage,
    typeofMedicine,
    instructions,
    daysOfWeek,
    times,
    startDate,
    endDate,
    reminderEnabled,
  } = req.body;
  try {
    const medicine = await Medicine.findOne({
      _id: medicineId,
      patientId: patientId,
    });
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    Object.keys(req.body).forEach((key) => (medicine[key] = req.body[key]));
    await medicine.save();

    res
      .status(200)
      .json({ message: "Medicine updated successfully", data: medicine });
  } catch (error) {
    console.error(error);
  }
};

const getAllMedicine = async (req, res) => {
  const { patientId } = req.params;
  try {
    const medicine = await Medicine.find({
      patientId,
    });

    if (!medicine) {
      res.status(200).json({ message: "Medicine Not found", data: medicine });
    }

    res
      .status(200)
      .json({ message: "Data fetch successfully", data: medicine });
  } catch (error) {
    console.error(error);
  }
};

const deleteMedicine = async (req, res) => {
  const { patientId, medicineId } = req.params;
  try {
    const medicine = await Medicine.findByIdAndDelete({
      patientId,
      _id: medicineId,
    });
    if (!medicine) {
      res.status(200).json({ message: "Medicine Not found", data: medicine });
    }

    res.status(200).json({
      message: "Medicine deleted successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { addMedicine, editMedicine, getAllMedicine, deleteMedicine };
