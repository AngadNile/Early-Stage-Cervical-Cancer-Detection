const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    reason: { type: String },
    symptoms: { type: String },
    status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
