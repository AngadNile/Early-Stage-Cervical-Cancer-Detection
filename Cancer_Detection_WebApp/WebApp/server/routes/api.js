const express = require("express");
const mongoose = require("mongoose");
const Patient = require("../models/Patient");
const User = require("../models/User");
const Hospital = require("../models/Hospital");
const Analysis = require("../models/Analysis");
const Assignment = require("../models/Assignment");
const Appointment = require("../models/Appointment");
const Chat = require("../models/Chat");

const router = express.Router();

const toObjectId = (id) => {
  if (!id) return null;
  try {
    return new mongoose.Types.ObjectId(id);
  } catch {
    return id;
  }
};

// ── PATIENTS ─────────────────────────────────────────────────────────────────
// GET all patients (optional filters: ashaWorkerId, doctorId)
router.get("/patients", async (req, res) => {
  try {
    const { ashaWorkerId, doctorId } = req.query;
    const filter = {};
    if (ashaWorkerId) filter.ashaWorkerId = toObjectId(ashaWorkerId);
    if (doctorId) filter.doctorId = toObjectId(doctorId);

    const patients = await Patient.find(filter).sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single patient by MongoDB ID, custom patientId code, or userId
router.get("/patients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let patient = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      patient = await Patient.findById(id);
      if (!patient) {
        patient = await Patient.findOne({ userId: toObjectId(id) });
      }
    }
    if (!patient) {
      patient = await Patient.findOne({ patientId: id });
    }
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new patient
router.post("/patients", async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update patient
router.put("/patients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let patient = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      patient = await Patient.findByIdAndUpdate(id, req.body, { new: true });
      if (!patient) {
        patient = await Patient.findOneAndUpdate({ userId: toObjectId(id) }, req.body, { new: true });
      }
    }
    if (!patient) {
      patient = await Patient.findOneAndUpdate({ patientId: id }, req.body, { new: true });
    }
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE patient
router.delete("/patients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Patient.findByIdAndDelete(id);
    } else {
      await Patient.findOneAndDelete({ patientId: id });
    }
    res.json({ success: true, message: "Patient deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── DOCTORS ──────────────────────────────────────────────────────────────────
// GET doctors
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update doctor profile
router.put("/doctors/:id", async (req, res) => {
  try {
    const doctor = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.json(doctor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE doctor
router.delete("/doctors/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Doctor deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── ASHA WORKERS ─────────────────────────────────────────────────────────────
// GET ASHA workers
router.get("/asha-workers", async (req, res) => {
  try {
    const ashaworkers = await User.find({ role: "aasha_worker" }).select("-password");
    res.json(ashaworkers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update ASHA worker profile
router.put("/asha-workers/:id", async (req, res) => {
  try {
    const worker = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    if (!worker) {
      return res.status(404).json({ error: "ASHA worker not found" });
    }
    res.json(worker);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE ASHA worker
router.delete("/asha-workers/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "ASHA worker deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── SCREENING UNITS (Lab, Pathology, Screening Van) ──────────────────────────
router.get("/screening-units", async (req, res) => {
  try {
    const units = await User.find({
      role: { $in: ["lab", "pathology", "screening_van"] }
    }).select("-password");
    res.json(units);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── HOSPITALS ────────────────────────────────────────────────────────────────
// GET hospitals
router.get("/hospitals", async (req, res) => {
  try {
    const hospitals = await Hospital.find().sort({ name: 1 });
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST hospital
router.post("/hospitals", async (req, res) => {
  try {
    const hospital = await Hospital.create(req.body);
    res.status(201).json(hospital);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── ASSIGNMENTS ──────────────────────────────────────────────────────────────
// GET assignments (with filters by doctorId, ashaWorkerId, or patientId)
router.get("/assignments", async (req, res) => {
  try {
    const { doctorId, ashaWorkerId, patientId } = req.query;
    const filter = {};
    if (doctorId) filter.doctorId = toObjectId(doctorId);
    if (ashaWorkerId) filter.ashaWorkerId = toObjectId(ashaWorkerId);
    if (patientId) filter.patientId = patientId;

    const assignments = await Assignment.find(filter).sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new assignment
router.post("/assignments", async (req, res) => {
  try {
    const { patientId, doctorId, ashaWorkerId, status, notes } = req.body;
    const assignment = await Assignment.create({
      patientId,
      doctorId: toObjectId(doctorId),
      ashaWorkerId: toObjectId(ashaWorkerId),
      status: status || "referred",
      notes: notes || "",
    });

    // Also link doctorId on the Patient document if present
    if (patientId && doctorId) {
      await Patient.findOneAndUpdate(
        { $or: [{ _id: toObjectId(patientId) }, { patientId }] },
        { doctorId: toObjectId(doctorId) }
      ).catch(() => {});
    }

    res.status(201).json(assignment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── ANALYSES ─────────────────────────────────────────────────────────────────
// GET analyses
router.get("/analyses", async (req, res) => {
  try {
    const { ashaWorkerId, doctorId, patientId } = req.query;
    const filter = {};
    if (ashaWorkerId) filter.ashaWorkerId = toObjectId(ashaWorkerId);
    if (doctorId) filter.doctorId = toObjectId(doctorId);
    if (patientId) filter.patientId = patientId;

    const analyses = await Analysis.find(filter).sort({ createdAt: -1 });
    res.json(analyses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST analysis
router.post("/analyses", async (req, res) => {
  try {
    const analysis = await Analysis.create(req.body);
    res.status(201).json(analysis);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update analysis (e.g. Doctor review)
router.put("/analyses/:id", async (req, res) => {
  try {
    const analysis = await Analysis.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!analysis) {
      return res.status(404).json({ error: "Analysis not found" });
    }
    res.json(analysis);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── APPOINTMENTS ─────────────────────────────────────────────────────────────
router.get("/appointments", async (req, res) => {
  try {
    const { patientId, doctorId } = req.query;
    const filter = {};
    if (patientId) filter.patientId = toObjectId(patientId);
    if (doctorId) filter.doctorId = toObjectId(doctorId);

    const appointments = await Appointment.find(filter).sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/appointments", async (req, res) => {
  try {
    const appt = await Appointment.create(req.body);
    res.status(201).json(appt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── CHATS ────────────────────────────────────────────────────────────────────
router.get("/chats", async (req, res) => {
  try {
    const { patientId, doctorId, ashaWorkerId } = req.query;
    const filter = {};
    if (patientId) filter.patientId = patientId;
    if (doctorId) filter.doctorId = toObjectId(doctorId);
    if (ashaWorkerId) filter.ashaWorkerId = toObjectId(ashaWorkerId);

    const chats = await Chat.find(filter).sort({ createdAt: 1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/chats", async (req, res) => {
  try {
    const chat = await Chat.create(req.body);
    res.status(201).json(chat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── STATS SUMMARY ─────────────────────────────────────────────────────────────
// GET /api/stats — Returns counts for all entity types in a single request
router.get("/stats", async (req, res) => {
  try {
    const [patients, doctors, ashaWorkers, screeningUnits, hospitals] = await Promise.all([
      Patient.countDocuments(),
      User.countDocuments({ role: "doctor" }),
      User.countDocuments({ role: "aasha_worker" }),
      User.countDocuments({ role: { $in: ["lab", "pathology", "screening_van"] } }),
      Hospital.countDocuments(),
    ]);
    res.json({ patients, doctors, ashaWorkers, screeningUnits, hospitals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
