const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    patientId: { type: String, required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ashaWorkerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["referred", "in_review", "screened", "completed"],
      default: "referred",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
