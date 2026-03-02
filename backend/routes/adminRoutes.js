const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

const Admin = require("../models/Admin");
const User = require("../models/User");
const Business = require("../models/Business");

/* ================= ADMIN LOGIN ================= */
/* ================= CREATE ADMIN (Use Once) ================= */

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "Admin already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashed
    });

    res.json({
      msg: "Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= PROTECTED ADMIN ROUTES ================= */

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Admin access required" });
  }
  next();
};

/* ================= GET ALL USERS ================= */

router.get("/users", auth, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

/* ================= GET ALL BUSINESSES ================= */

router.get("/businesses", auth, adminOnly, async (req, res) => {
  const businesses = await Business.find().select("-password");
  res.json(businesses);
});

/* ================= DELETE USER ================= */

router.delete("/users/:id", auth, adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: "User deleted" });
});

/* ================= DELETE BUSINESS ================= */

router.delete("/businesses/:id", auth, adminOnly, async (req, res) => {
  await Business.findByIdAndDelete(req.params.id);
  res.json({ msg: "Business deleted" });
});

module.exports = router;