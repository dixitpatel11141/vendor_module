const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/config');

const Vendor = sequelize.define('Vendor', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  company_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      is: {
        args: /^[a-zA-Z0-9 ]+$/i,
        msg: 'Company name must be alphanumeric including spaces'
      },
      notEmpty: { msg: 'Company name is required' },
      len: { args: [0,100], msg: 'Company name length can\'t be exceed 100 characters' }
    }
  },
  contact_person_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      is: {
        args: /^[a-zA-Z0-9 ]+$/i,
        msg: 'Contact person name must be alphanumeric including spaces'
      },
      notEmpty: { msg: 'Contact person name is required' },
      len: { args: [0,100], msg: 'Contact person name length can\'t be exceed 100 characters' }
    }
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: {
        msg: "Email is already taken."
    },
    validate: {
      notEmpty: { msg: "Email can't be empty." },
      isEmail: { msg: 'Invalid email' },
      len: { args: [0,150], msg: 'Email length can\'t be exceed 150 characters' }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isStrongPassword(value) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
        if (!regex.test(value)) {
          throw new Error('Password must be at least 8 characters, include 1 uppercase, 1 lowercase, and 1 symbol.');
        }
      }
    }
  },
  phone_number: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      isNumeric: { msg: 'Phone number must be numeric' },
      len: { args: [10,10], msg: 'Phone number must be 10 digits' }
    }
  },
  business_type: {
    type: DataTypes.ENUM('Manufacturer','Distributor','Wholesaler','Retailer','Service'),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      len: { args: [0,255], msg: 'Address length can\'t be exceed 255 characters' }
    }
  },
  country: {
    type: DataTypes.ENUM('India','Global'),
    allowNull: false
  },
  gst_number: {
    type: DataTypes.STRING(15),
    allowNull: false,
    validate: {
      isValidGST(value) {
        if (this.country === 'India') {
          const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[Z]{1}[0-9A-Z]{1}$/;
          if (!gstRegex.test(value)) {
            throw new Error('Invalid GST number format for India. It should be 15 characters long and with valid structure i.e. 07ABCDE1234F2Z5');
          }
        } else if (this.country === 'Global') {
          const globalRegex = /^[a-zA-Z0-9]{5,15}$/;
          if (!globalRegex.test(value)) {
            throw new Error('Invalid Tax ID format for Global. It should be alphanumeric and 5-15 characters long.');
          }
        }
      }
    }
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'vendors',
  timestamps: true
});

module.exports = Vendor;
