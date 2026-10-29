const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    patientId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, default: "Female" },
    phone: { type: String },
    address: { type: String },
    medicalHistory: { type: String },
    symptoms: { type: String },
    email: { type: String },
    ashaWorkerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    preferredHospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
