const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { jwtSecret } = require('../config/auth');

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, mobile_number, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findByMobile(mobile_number);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const userData = {
      first_name,
      last_name,
      mobile_number,
      password,
      created_by: 'system'
    };
    
    const user = await User.create(userData);
    
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { mobile_number, password } = req.body;
    
    // Find user
    const user = await User.findByMobile(mobile_number);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

  
    const token = jwt.sign(
      { id: user.id, mobile_number: user.mobile_number },
      jwtSecret,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        mobile_number: user.mobile_number
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};