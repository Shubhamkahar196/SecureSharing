const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        // Get token from header
        token = req.headers.authorization.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Get user from the token
        req.user = await User.findById(decoded.id).select('-password');

        next();
      } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Not authorized' });
      }
    }

    if (!token) {
      res.status(401).json({ message: 'Not authorized, no token' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
