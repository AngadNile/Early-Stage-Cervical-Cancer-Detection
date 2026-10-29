const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Patient = require("../models/Patient");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "cervical_cancer_secret_key_12345";

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "30d" });
};

// @route   POST /api/auth/register
// @desc    Register a new user
router.post("/register", async (req, res) => {
  try {
    const {
      name, email, password, role, phone, address, region,
      specialization, hospitalId, experience, createdBy,
      patientId, age, gender, medicalHistory, ashaWorkerId, symptoms,
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: "User already exists with this email" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "patient",
      phone: phone || "",
      address: address || "",
      region: region || "",
      specialization: specialization || "",
      hospitalId: hospitalId || null,
      experience: experience || "",
      createdBy: createdBy || null,
    });

    // Also create a Patient record when registering a patient
    if ((role || "patient") === "patient") {
      const pId = patientId || `PAT${Math.floor(10000 + Math.random() * 90000)}`;
      await Patient.create({
        patientId: pId,
        name: name || "",
        age: Number(age) || 0,
        gender: gender || "Female",
        phone: phone || "",
        email: email || "",
        address: address || "",
        medicalHistory: medicalHistory || "",
        symptoms: symptoms || "",
        ashaWorkerId: ashaWorkerId || null,
        userId: user._id,
        createdBy: createdBy || null,
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
