const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "patient",
    },
    name: {
      type: String,
      required: true,
    },
    frequency: {
      type: String,
      // e.g., "3 times a day")
    },
    dosage: {
      type: String,
      // (e.g., "2 tablets", "5ml")
    },
    typeofMedicine: {
      type: String,
    },
    instructions: {
      type: [String], // e.g., ["After breakfast", "Before dinner"]
      default: [],
    },
    daysOfWeek: {
      type: [String], // e.g., ["Monday", "Wednesday", "Friday"]
      default: [],
    },
    times: {
      type: [String], // e.g., ["08:00", "20:00"]
      default: [],
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    reminderEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Medicine", medicineSchema);
