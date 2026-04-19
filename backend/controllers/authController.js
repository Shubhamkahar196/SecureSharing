const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Generate JWT Token
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
//     expiresIn: '30d',
//   });
// };

//    Register new user
//   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    
    email = email.toLowerCase().trim();

   
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: 'User already exists' });
    }
     
    const hashedPassword = await bcrypt.hash(password,10);
    
    const user = await User.create({
      email,
      password: hashedPassword
    });

    
    const token = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10d' }
    );

   
    res.status(201).json({
      _id: user._id,
      email: user.email,
      token,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//    Authenticate a user
//    POST /api/auth/login
//   Public

const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

   
    email = email.toLowerCase().trim();


    const user = await User.findOne({ email }).select('+password');


    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

   
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

   
    const token = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10d' }
    );

    
    res.status(200).json({
      message: "User login successfully",
      _id: user._id,
      email: user.email,
      token,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//     Get user data
//    GET /api/auth/me
//   Private
const getMe = async (req, res) => {
  try {
    
    const user = await User.findById(req.user.id);

   
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

 
    res.status(200).json({
      _id: user._id,
      email: user.email,
      createdAt: user.createdAt,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};