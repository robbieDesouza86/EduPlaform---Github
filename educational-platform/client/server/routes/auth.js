const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Make sure to install and import jsonwebtoken
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Add these functions at the top of the file after the imports
function generateTeacherId() {
  const prefix = 'T';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
}

function generateStudentId() {
  const prefix = 'S';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
}

router.post('/signup', upload.single('profilePicture'), async (req, res) => {
  try {
    const { name, email, password, dateOfBirth, gender, nationality, role, subjects } = req.body;

    // Check if user already exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate unique ID based on role
    let uniqueId = null;
    let isUnique = false;
    
    while (!isUnique) {
      uniqueId = role === 'teacher' ? generateTeacherId() : generateStudentId();
      // Check if ID already exists
      const existingUser = await User.findOne({ 
        where: role === 'teacher' ? 
          { teacherId: uniqueId } : 
          { studentId: uniqueId }
      });
      if (!existingUser) {
        isUnique = true;
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with appropriate ID field
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      dateOfBirth,
      gender,
      nationality,
      role,
      subjects: subjects ? JSON.parse(subjects) : [],
      profilePicture: req.file ? req.file.filename : null,
      ...(role === 'teacher' ? { teacherId: uniqueId } : { studentId: uniqueId })
    });

    // Create and sign a JWT
    const payload = {
      user: {
        id: newUser.id,
        role: newUser.role,
        uniqueId: role === 'teacher' ? newUser.teacherId : newUser.studentId
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          message: 'User registered successfully',
          token,
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            uniqueId: role === 'teacher' ? newUser.teacherId : newUser.studentId
          }
        });
      }
    );
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error in user registration', error: error.message });
  }
});

// Add a login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and sign a JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Make sure to set this in your .env file
      { expiresIn: '8h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Export the router
module.exports = router;