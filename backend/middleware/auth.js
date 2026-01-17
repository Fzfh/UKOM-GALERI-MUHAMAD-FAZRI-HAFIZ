const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }

    req.user = user;
    next();

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    console.log('🔐 AUTHORIZE - User role:', req.user?.role, 'Required:', roles);
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No user information.'
      });
    }

    // Support both 'admin' and 'administrator' roles
    const userRole = req.user.role;
    
    if (userRole === 'administrator' && roles.includes('admin')) {
      console.log('✅ Treating "administrator" as "admin"');
      return next();
    }

    if (!roles.includes(userRole)) {
      console.log('❌ Insufficient permissions');
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }
    
    console.log('✅ Authorization successful');
    next();
  };
};

module.exports = { authenticate, authorize };