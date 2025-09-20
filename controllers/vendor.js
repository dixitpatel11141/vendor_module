const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Vendor = require('../models/vendor');

// Register new Vendor
const register = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Get fields from request body
    const { company_name, contact_person_name, email, password, phone_number, business_type, address, country, gst_number } = req.body;

    // Check if email already exists for another Vendor
    const existing = await Vendor.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use for another Vendor' });
    }

    // Encrypt password using bcrypt
    const hashed = await bcrypt.hash(password, 10);

    // Create payload for new Vendor
    const payload = { company_name, contact_person_name, email, password: hashed, phone_number, business_type, address, country, gst_number };

    // Get vendor logo name if uploaded
    if (req.file) {
      payload.logo = req.file.filename;
    }

    // Create new Vendor
    const vendor = await Vendor.create(payload);
    res.status(201).json({ message: 'Vendor is registered successfully', vendor: { id: vendor.id, company_name: vendor.company_name, email: vendor.email } });
  } catch (err) {
    next(err);
  }
};

// Login Vendor
const login = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Get fields from request body
    const { email, password } = req.body;

    // Find vendor by email
    const vendor = await Vendor.findOne({ where: { email } });

    // Check if vendor exists or not
    if (!vendor) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const match = await bcrypt.compare(password, vendor.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: vendor.id, email: vendor.email }, process.env.JWT_SECRET || 'default_secret', { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });

    return res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
