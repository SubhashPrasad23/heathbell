const Patient = require("../models/patient");

const addPatient = async (req, res) => {
  const { name, age, gender,contact } = req.body;
  const { userId } = req.params;

  try {
    const newPatient = new Patient({
      userId,
      name,
      age,
      gender,
      contact
    });
    await newPatient.save();

    res
      .status(200)
      .json({ message: "Patient added successfully", data: newPatient });
  } catch (error) {
    console.error(error);
  }
};

const getAllPatient = async (req, res) => {
  const { userId } = req.params;
  try {
    const getAllPatient = await Patient.find({ userId });

    res.status(200).json({
      message: "data fetch successfully",
      data: getAllPatient,
    });
  } catch (error) {
    console.error(error);
  }
};

const editPatient = async (req, res) => {
  try {
    const { userId, patientId } = req.params;
    const { name, age, gender } = req.body;

    const patient = await Patient.findOne({ _id: patientId, userId: userId });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    
    Object.keys(req.body).forEach((key) => {
      patient[key] = req.body[key];
    });

    await patient.save();

    res.status(200).json({
      message: "Patient updated successfully",
      data: patient,
    });
  } catch (error) {
    console.error(error);
  }
};

const deletePatient = async (req, res) => {
  try {
    const { userId, patientId } = req.params;

    

    const patient = await Patient.findByIdAndDelete({ _id: patientId,userId:userId });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json({
      message: "Patient deleted successfully",
      data: patient,
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { addPatient, getAllPatient, editPatient, deletePatient };
