// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const verificationTokenSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 600, // 10 minutes
    default: Date.now,

}

});

// Hash password before saving
verificationTokenSchema.pre('save', async function(next) {
  if (this.isModified('token')) {
    this.token = await bcrypt.hash(this.token, 10);
  }
  next();
});

// Compare password
verificationTokenSchema.methods.matchToken = async function(token) {
  return await bcrypt.compare(token, this.token);
};

module.exports = mongoose.model('VerificationToken', verificationTokenSchema);

