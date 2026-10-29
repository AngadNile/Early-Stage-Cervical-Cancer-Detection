const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    patientId: { type: String, required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ashaWorkerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    senderType: { type: String, enum: ["doctor", "patient", "ashaWorker"], required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
