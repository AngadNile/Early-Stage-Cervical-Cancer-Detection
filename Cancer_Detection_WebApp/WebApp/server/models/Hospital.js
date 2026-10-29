const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["Government", "Private"], default: "Government" },
    city: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String },
    doctorIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hospital", hospitalSchema);
