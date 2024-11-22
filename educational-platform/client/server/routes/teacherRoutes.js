const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Op = require('sequelize').Op;
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

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

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Get teacher profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Make sure we're including the teacherId in the response
    const userProfile = user.toJSON();
    
    // If teacherId is not already included, get it from the user object
    if (!userProfile.teacherId) {
      userProfile.teacherId = user.teacherId || user.teacher_id;
    }

    res.json(userProfile);
  } catch (error) {
    console.error('Error fetching teacher profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update teacher profile
router.put('/profile', verifyToken, upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'introductionVideo', maxCount: 1 }
]), async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Create base update data object with all possible fields
    const updateData = {
      name: req.body.name,
      timeZone: req.body.timeZone,
      profileVisibility: req.body.profileVisibility,
      paypalEmail: req.body.paypalEmail,
      standardClassRate: req.body.standardClassRate ? parseFloat(req.body.standardClassRate) : null,
      trialClassRate: req.body.trialClassRate ? parseFloat(req.body.trialClassRate) : null,
      // Include these fields but only if they exist in the request
      title: req.body.title,
      gender: req.body.gender,
      nationality: req.body.nationality,
      dateOfBirth: req.body.dateOfBirth,
      introductionWriteup: req.body.introductionWriteup,
      studentAgeGroup: req.body.studentAgeGroup,
      studentProficiency: req.body.studentProficiency,
    };

    // Only parse JSON fields if they exist in the request
    const jsonFields = ['education', 'workExperience', 'certificates', 'subjects', 'interests', 'languages', 'teachingStyles'];
    jsonFields.forEach(field => {
      if (req.body[field]) {
        try {
          updateData[field] = JSON.parse(req.body[field]);
        } catch (e) {
          console.warn(`Failed to parse ${field}, skipping...`);
        }
      }
    });

    // Handle file uploads if they exist
    if (req.files?.profilePicture) {
      const oldUser = await User.findByPk(userId);
      if (oldUser.profilePicture) {
        try {
          await fs.unlink(path.join(__dirname, '..', 'uploads', oldUser.profilePicture));
        } catch (err) {
          console.error('Error deleting old profile picture:', err);
        }
      }
      updateData.profilePicture = req.files.profilePicture[0].filename;
    }

    if (req.files?.introductionVideo) {
      const oldUser = await User.findByPk(userId);
      if (oldUser.introductionVideo) {
        try {
          await fs.unlink(path.join(__dirname, '..', 'uploads', oldUser.introductionVideo));
        } catch (err) {
          console.error('Error deleting old introduction video:', err);
        }
      }
      updateData.introductionVideo = req.files.introductionVideo[0].filename;
    }

    // Remove undefined values from updateData
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    // Update the user
    await User.update(updateData, {
      where: { id: userId }
    });

    // Fetch and return the updated user
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

async function deleteFile(filePath) {
  try {
    await fs.unlink(filePath);
    console.log(`Successfully deleted ${filePath}`);
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
  }
}

// Fetch teachers
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      where: {
        role: 'teacher',
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { '$subjects$': { [Op.like]: `%${search}%` } }
        ]
      },
      limit,
      offset,
      attributes: ['id', 'name', 'profilePicture', 'subjects'],
    });

    res.json({
      teachers: rows,
      total: count,
    });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
