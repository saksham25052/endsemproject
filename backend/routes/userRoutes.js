// backend/routes/userRoutes.js
const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { generateVerificationCode, mailTransport } = require('../library/mail');
const { isValidObjectId } = require('mongoose');
const verification = require('../models/verificationToken');
const { getUserProfile, updateUserProfile } = require('../controllers/user');
const authLib = require('../library/authLib');

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
      subject: 'Account verification',
      html: `<h1>Verification code: ${verificationCode}</h1>`, 
      from: 'countmein25052@gmail.com',
      to: email,
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
