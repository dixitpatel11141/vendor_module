const express = require('express');
const { body } = require('express-validator');
const upload = require('../middleware/upload');
const vendor = require('../controllers/vendor');

const router = express.Router();

// Add Vendor details
router.post('/register', upload.single('logo'), [
  body('company_name').trim().notEmpty().withMessage('Company name is required').isAlphanumeric('en-US', { ignore: ' ' }).withMessage('Company name must be alphanumeric'),
  body('contact_person_name').trim().notEmpty().withMessage('Contact person name is required').isAlphanumeric('en-US', { ignore: ' ' }).withMessage('Contact person name must be alphanumeric'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/).withMessage('Password must be at least 8 characters, include 1 uppercase, 1 lowercase, and 1 symbol.'),
  body('phone_number').isNumeric().isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 digits'),
  body('business_type').isIn(['Manufacturer', 'Distributor', 'Wholesaler', 'Retailer', 'Service']).withMessage('Invalid business type'),
  body('address').optional().isLength({ max: 255 }).withMessage('Address length can\'t be exceed 255 characters'),
  body('country').isIn(['India', 'Global']).withMessage('Invalid country'),
  body('gst_number').notEmpty().withMessage('GST Number / Tax ID is required').custom((value, { req }) => {
    if (req.body.country === 'India') {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[Z]{1}[0-9A-Z]{1}$/;
      if (!gstRegex.test(value)) {
        throw new Error('Invalid GST number format for India. It should be 15 characters long and with valid structure i.e. 07ABCDE1234F2Z5');
      }
    } else if (req.body.country === 'Global') {
      const globalRegex = /^[a-zA-Z0-9]{5,15}$/;
      if (!globalRegex.test(value)) {
        throw new Error('Invalid Tax ID format for Global. It should be alphanumeric and 5-15 characters long.');
      }
    }
    return true;
  }),
], vendor.register);

// Login Vendor
router.post('/login', [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required')
], vendor.login);

module.exports = router;
