// server/controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new client
// @route   POST /api/auth/register/client
// @access  Public
exports.registerClient = async (req, res) => {
  try {
    const { name, email, phone, country, visitPurpose } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and phone are required',
      });
    }

    // Check if email already exists
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Check if phone already exists
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this phone number already exists',
      });
    }

    // Create client user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      country,
      visitPurpose,
      role: 'client',
    });

    res.status(201).json({
      success: true,
      message: 'Client account created successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        visitPurpose: user.visitPurpose,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register new admin
// @route   POST /api/auth/register/admin
// @access  Private (requires existing admin token OR secret key)
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword, adminSecret } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Verify admin secret key from environment
    if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({
        success: false,
        message: 'Invalid admin secret key',
      });
    }

    // Check passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Check if email already exists
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Create admin user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password, // will be hashed by pre-save hook
      role: 'admin',
    });

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login client
// @route   POST /api/auth/login/client
// @access  Public
exports.loginClient = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Email and phone number are required',
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      phone,
      role: 'client',
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or phone number',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Contact support.',
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login admin
// @route   POST /api/auth/login/admin
// @access  Public
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      role: 'admin',
    });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated',
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};