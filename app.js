require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const vendorRoutes = require('./routes/vendor');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Upload vendor logo
app.use('/images', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'images')));

// To verify if the server is running
app.get('/', (req, res) => {
    res.send(`Building a Vendor Module with Node.js (B2B Marketplace)`);
    console.log("Building a Vendor Module with Node.js (B2B Marketplace)");
});

// Vendor and Authentication routes
app.use('/api/vendors', authRoutes);
app.use('/api/auth/vendor/', vendorRoutes);

// Error handler
app.use(errorHandler);

module.exports = app;
