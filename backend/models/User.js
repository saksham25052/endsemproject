// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const verificationToken = require('./verificationToken');
//const {sendError} = require('../library/errorHandler');



const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    default: 'user',
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  Timestamp: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;

