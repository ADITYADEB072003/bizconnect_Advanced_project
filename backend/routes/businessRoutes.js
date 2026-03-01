const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const Business = require('../models/Business');

/* ================= REGISTER ================= */

router.post('/register', async (req, res) => {
    try {
        const {
            businessName,
            ownerName,
            email,
            password,
            category,
            description,
            location
        } = req.body;

        const existing = await Business.findOne({ email });
        if (existing) {
            return res.status(400).json({ msg: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await Business.create({
            businessName,
            ownerName,
            email,
            password: hashedPassword,
            category,
            description,
            location
        });

        res.json({ msg: "Business Registered Successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* ================= LOGIN ================= */

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const business = await Business.findOne({ email });
        if (!business) {
            return res.status(400).json({ msg: "Invalid Email or Password" });
        }

        const isMatch = await bcrypt.compare(password, business.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid Email or Password" });
        }

        const token = jwt.sign(
            { id: business._id, role: "business" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            business: {
                id: business._id,
                businessName: business.businessName,
                email: business.email
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* ================= GET ALL BUSINESSES ================= */

router.get('/', async (req, res) => {
    const businesses = await Business.find();
    res.json(businesses);
});

/* ================= GET SINGLE BUSINESS ================= */

router.get('/:id', async (req, res) => {
    const business = await Business.findById(req.params.id);
    res.json(business);
});

/* ================= UPDATE BUSINESS (Protected) ================= */

router.put('/:id', auth, async (req, res) => {

    // 🔒 Prevent updating someone else's business
    if (req.user.id !== req.params.id) {
        return res.status(403).json({ msg: "Not authorized" });
    }

    const updated = await Business.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json(updated);
});

module.exports = router;