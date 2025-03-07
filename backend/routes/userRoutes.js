// backend/routes/userRoutes.js
const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { generateVerificationCode, mailTransport } = require('../library/mail');
const { isValidObjectId } = require('mongoose');
const verification = require('../models/verificationToken');
const { getUserProfile, updateUserProfile } = require('../controllers/user');
const authLib = require('../library/authLib.js');

// Register new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
         username, 
         email, 
         password }
    );
    const verificationCode = generateVerificationCode();
    const verificationToken = new verification({
        owner: user._id, 
        token: verificationCode });
        
    await verificationToken.save();
    await user.save();

    mailTransport().sendMail({
      from: 'countmein25052@gmail.com',
      to: email,
      subject: 'Verify Your CountMeIn Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #4f46e5; text-align: center; margin-bottom: 30px;"> CountMeIn! 🎟️</h1>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #1f2937; margin-top: 0; margin-bottom: 20px;">Verification Code:</h2>
              <div style="background-color: #eef2ff; padding: 15px; border-radius: 6px; text-align: center;">
                <span style="font-size: 32px; font-weight: bold; color: #4f46e5; letter-spacing: 4px;">${verificationCode}</span>
              </div>
            </div>

            <div style="text-align: center; color: #4b5563; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="margin-bottom: 10px;">Please enter this code to verify your account.</p>
              <p style="margin: 0;">This code will expire in 10 minutes.</p>
            </div>

            <div style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px;">
              <p style="margin: 5px 0;">If you didn't request this verification code, please ignore this email.</p>
              <p style="margin: 5px 0;">© ${new Date().getFullYear()} CountMeIn. All rights reserved.</p>
            </div>
          </div>
        </div>
      `
    });

   
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify user

router.post('/verify', async (req, res) => {
  console.log(req.body);
  const { email, verificationCode } = req.body;

  if(!email || !verificationCode) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  // if(!isValidObjectId(email)) {
  //   return res.status(400).json({ message: 'Invalid email' });
  // }

  const user = await User.findOne({ email });
  console.log(user._id.toString());
  if(!user)
     {
    
    return res.status(400).json({ message: 'User not found' });
  }

  if(user.isVerified) {
    return res.status(400).json({ message: 'User already verified' });
  }

  const token = await verification.findOne({  owner: user._id.toString() });
  if(!token) {
    console.log(token);
    return res.status(400).json({ message: 'Invalid verification code 100' });
  }

  const isMatched = await token.matchToken(verificationCode);
  if(!isMatched) {
    return res.status(400).json({ message: 'Invalid verification code tata' });
  }
  else{
    user.isVerified = true;
    await verification.findByIdAndDelete(token._id); // Delete the verification token
    await user.save();
    return res.status(200).json({ message: 'User verified' });
    
  }
 
});

//to fetch user data
router.get('/profile', authLib, getUserProfile);
router.put('/profile', authLib, updateUserProfile);

module.exports = router;
