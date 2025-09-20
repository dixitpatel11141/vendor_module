const express = require('express');
const { body, param, query } = require('express-validator');
const upload = require('../middleware/upload');
const authController = require('../controllers/auth');
const authenticate = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[Z]{1}[0-9A-Z]{1}$/;
const globalRegex = /^[a-zA-Z0-9]{5,15}$/;

// Get Vendor list with pagination and search by companyName/email
router.get('/', [
  query('page').optional().toInt(),
  query('limit').optional().toInt(),
  query('search').optional().trim()
], authController.list);

// Get Vendor by ID
router.get('/:id', [
  param('id').isInt().withMessage('Invalid vendor id')
], authController.getById);

// Create Vendor (Admin Only)
router.post('/', upload.single('logo'), [
  body('company_name').trim().notEmpty().withMessage('Company name is required').isAlphanumeric('en-US', { ignore: ' ' }).withMessage('Company name must be alphanumeric'),
  body('contact_person_name').trim().notEmpty().withMessage('Contact person name is required').isAlphanumeric('en-US', { ignore: ' ' }).withMessage('Contact person name must be alphanumeric'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').matches(passwordRegex).withMessage('Password must be at least 8 characters, include 1 uppercase, 1 lowercase, and 1 symbol.'),
  body('phone_number').isNumeric().isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 digits'),
  body('business_type').isIn(['Manufacturer', 'Distributor', 'Wholesaler', 'Retailer', 'Service']).withMessage('Invalid business type'),
  body('address').optional().isLength({ max: 255 }).withMessage('Address length can\'t be exceed 255 characters'),
  body('country').isIn(['India', 'Global']).withMessage('Invalid country'),
  body('gst_number').notEmpty().withMessage('GST Number / Tax ID is required').custom((value, { req }) => {
    if (req.body.country === 'India') {
      if (!gstRegex.test(value)) {
        throw new Error('Invalid GST number format for India. It should be 15 characters long and with valid structure i.e. 07ABCDE1234F2Z5');
      }
    } else if (req.body.country === 'Global') {
      if (!globalRegex.test(value)) {
        throw new Error('Invalid Tax ID format for Global. It should be alphanumeric and 5-15 characters long.');
      }
    }
    return true;
  }),
], authController.create);

// Update Vendor
router.put('/:id', upload.single('logo'), [
  param('id').isInt().withMessage('Invalid vendor id'),
  body('company_name').optional().trim().notEmpty().withMessage('Company name is required').isAlphanumeric('en-US', { ignore: ' ' }).withMessage('Company name must be alphanumeric'),
  body('contact_person_name').optional().trim().notEmpty().withMessage('Contact person name is required').isAlphanumeric('en-US', { ignore: ' ' }).withMessage('Contact person name must be alphanumeric'),
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('password').optional().matches(passwordRegex).withMessage('Password must be at least 8 characters, include 1 uppercase, 1 lowercase, and 1 symbol.'),
  body('phone_number').optional().isNumeric().isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 digits'),
  body('business_type').optional().isIn(['Manufacturer', 'Distributor', 'Wholesaler', 'Retailer', 'Service']).withMessage('Invalid business type'),
  body('address').optional().isLength({ max: 255 }).withMessage('Address length can\'t be exceed 255 characters'),
  body('country').optional().isIn(['India', 'Global']).withMessage('Invalid country'),
  body('gst_number').optional().notEmpty().withMessage('GST Number / Tax ID is required').custom((value, { req }) => {
    if (req.body.country === 'India') {
      if (!gstRegex.test(value)) {
        throw new Error('Invalid GST number format for India. It should be 15 characters long and with valid structure i.e. 07ABCDE1234F2Z5');
      }
    } else if (req.body.country === 'Global') {
      if (!globalRegex.test(value)) {
        throw new Error('Invalid Tax ID format for Global. It should be alphanumeric and 5-15 characters long.');
      }
    }
    return true;
  }),
], authController.update);

// Delete Vendor
router.delete('/:id', [
  param('id').isInt().withMessage('Invalid vendor id')
], authController.delete);

// Verify Vendor (Admin)
router.patch('/:id/verify', [
  param('id').isInt().withMessage('Invalid vendor id')
], authController.verify);

// Fetch vendor logo
router.get('/:id/logo', [
  param('id').isInt().withMessage('Invalid vendor id')
], authController.getLogo);

module.exports = router;
