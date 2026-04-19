const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    //  Validate header format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    //  Extract token
    const token = authHeader.split(' ')[1];

    //  Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    //  Fetch user (fresh data, no password)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    //Attach user to request
    req.user = user;

    next();
  } catch (error) {
    // Differentiate token errors (optional but good)
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }

    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };













// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const protect = async (req, res, next) => {
//   try {
//     let token;

//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//       try {
//         // Get token from header
//         token = req.headers.authorization.split(' ')[1];

//         // Verify token
//         const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//         // Get user from the token
//         req.user = await User.findById(decoded.id).select('-password');

//         next();
//       } catch (error) {
//         console.log(error);
//         res.status(401).json({ message: 'Not authorized' });
//       }
//     }

//     if (!token) {
//       res.status(401).json({ message: 'Not authorized, no token' });
//     }
//   } catch (error) {
//     res.status(401).json({ message: 'Not authorized, token failed' });
//   }
// };

// module.exports = { protect };
