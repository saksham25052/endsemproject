const User = require('../models/user');

exports.createUser = async (req, res) => {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user)
        res.status(400).json({ message: 'User already exists' });
    
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.send(newUser);
};

exports.logIn = async (req, res) => {
    const { email, password } = req.body
    if(!email || !password)
        res.status(400).json({ message: 'Invalid credentials!' });

    const user = await User.findOne({ email });
    if (!user)
        res.status(400).json({ message: 'User not found' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
        res.status(400).json({ message: 'Invalid credentials' });

}
