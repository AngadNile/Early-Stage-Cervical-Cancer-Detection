const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    patientId: { type: String, required: true }, // custom patientId or _id string
    imageUrl: { type: String, required: true },
    analysis: { type: String },
    result: { type: String, enum: ["normal", "mild", "abnormal"] },
    riskLevel: { type: String, enum: ["low", "medium", "high"], default: "low" },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ashaWorkerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorFeedback: { type: String },
    nextSteps: { type: String },
    doctorReviewAt: { type: Date },
    prediction: { type: String },
    confidence: { type: Number },
    threshold: { type: Number, default: 0.55 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analysis", analysisSchema);
