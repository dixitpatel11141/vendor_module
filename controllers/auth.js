const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const Vendor = require('../models/vendor');

// Get Vendor list with pagination and search
const list = async (req, res, next) => {
  try {
    // Query params: page, limit, search
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const where = {};

    // Apply where condition for search on company_name or email
    if (search) {
      where[Op.or] = [
        { company_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Vendor.findAndCountAll({ where, limit, offset, order: [['id', 'DESC']], attributes: { exclude: ['password'] } });
    res.status(200).json({
      meta: { total: count, page, lastPage: Math.ceil(count / limit) },
      data: rows
    });
  } catch (err) {
    next(err);
  }
};

// Get Vendor by ID
const getById = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Get vendor by ID
    const id = req.params.id;
    const vendor = await Vendor.findByPk(id, { attributes: { exclude: ['password'] } });
    if (!vendor) {
      return res.status(404).json({ message: 'Requested vendor not found' });
    }

    res.status(200).json(vendor);
  } catch (err) {
    next(err);
  }
};

// Create Vendor (Admin Only)
const create = async (req, res, next) => {
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
    res.status(201).json({ message: 'Vendor is created successfully', vendor: { id: vendor.id, company_name: vendor.company_name, email: vendor.email } });
  } catch (err) {
    next(err);
  }
};

// Update Vendor
const update = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Find vendor by ID
    const id = req.params.id;
    const vendor = await Vendor.findByPk(id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Get fields from request body
    const { company_name, contact_person_name, email, password, phone_number, business_type, address, country, gst_number } = req.body;

    // Check if email already exists for another Vendor
    if (email && email !== vendor.email) {
      const existing = await Vendor.findOne({ where: { email } });
      if (existing) {
        return res.status(400).json({ message: 'Email already in use for another Vendor' });
      }
    }

    // Update fields if provided
    if (company_name) vendor.company_name = company_name;
    if (contact_person_name) vendor.contact_person_name = contact_person_name;
    if (email) vendor.email = email;
    if (password) vendor.password = await bcrypt.hash(password, 10);
    if (phone_number) vendor.phone_number = phone_number;
    if (business_type) vendor.business_type = business_type;
    if (address !== undefined) vendor.address = address;
    if (country) vendor.country = country;
    if (gst_number) vendor.gst_number = gst_number;
    if (req.file) vendor.logo = req.file.filename;

    // Update details in database
    await vendor.save();
    res.status(200).json({ message: 'Vendor details updated successfully', vendor: { id: vendor.id, company_name: vendor.company_name, email: vendor.email, address: vendor.address, phone_number: vendor.phone_number, business_type: vendor.business_type, country: vendor.country, gst_number: vendor.gst_number } });
  } catch (err) {
    next(err);
  }
};

// Delete Vendor
const deleteVendor = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Find vendor by ID
    const id = req.params.id;
    const vendor = await Vendor.findByPk(id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor is not found for provided id' });
    }

    // Delete vendor logo file if exists
    if (vendor.logo) {
      const fs = require('fs');
      fs.unlink(`${process.env.UPLOAD_DIR || 'images'}/${vendor.logo}`, (err) => {
        if (err) {
          console.error('Error deleting logo file:', err);
        }
      });
    }

    // Delete vendor from database
    await vendor.destroy();
    res.status(200).json({ message: 'Vendor deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// Verify Vendor (Admin)
const verifyVendor = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Find vendor by ID
    const id = req.params.id;
    const vendor = await Vendor.findByPk(id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor is not found for provided id' });
    }

    // Mark vendor as verified
    vendor.is_verified = true;
    await vendor.save();

    res.status(200).json({ message: 'Vendor verified successfully', vendor: { id: vendor.id, company_name: vendor.company_name, email: vendor.email, is_verified: vendor.is_verified } });
  } catch (err) {
    next(err);
  }
};

// Fetch vendor logo
const getLogo = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Find vendor by ID
    const id = req.params.id;
    const vendor = await Vendor.findByPk(id);
    if (!vendor || !vendor.logo) {
      return res.status(404).json({ message: 'Vendor logo not found' });
    }

    // Send logo file
    const path = require('path');
    res.status(200).sendFile(path.resolve(`${process.env.UPLOAD_DIR || 'images'}/${vendor.logo}`));
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getById, create, update, delete: deleteVendor, verify: verifyVendor, getLogo };
