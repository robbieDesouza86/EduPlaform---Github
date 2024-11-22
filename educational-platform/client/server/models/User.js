const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'date_of_birth'
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true
  },
  nationality: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('student', 'teacher'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  education: {
    type: DataTypes.JSON,
    allowNull: true
  },
  workExperience: {
    type: DataTypes.JSON,
    allowNull: true
  },
  certificates: {
    type: DataTypes.JSON,
    allowNull: true
  },
  subjects: {
    type: DataTypes.JSON,
    allowNull: true
  },
  interests: {
    type: DataTypes.JSON,
    allowNull: true
  },
  languages: {
    type: DataTypes.JSON,
    allowNull: true
  },
  specialties: {
    type: DataTypes.JSON,
    allowNull: true
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'profile_picture'
  },
  introductionVideo: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'introduction_video'
  },
  introductionWriteup: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'introduction_writeup'
  },
  studentAgeGroup: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'student_age_group'
  },
  studentProficiency: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'student_proficiency'
  },
  teachingStyles: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'teaching_styles'
  },
  selectedStyle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profileVisibility: {
    type: DataTypes.ENUM('public', 'private'),
    defaultValue: 'public',
    field: 'profile_visibility'
  },
  paypalEmail: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'paypal_email'
  },
  standardClassRate: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'standard_class_rate'
  },
  trialClassRate: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'trial_class_rate'
  },
  timeZone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  teacherId: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'teacher_id',
    unique: true
  },
  studentId: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'student_id',
    unique: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'updated_at'
  }
}, {
  tableName: 'Users',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeUpdate: (user) => {
      user.updatedAt = Sequelize.literal('CURRENT_TIMESTAMP');
    }
  }
});

module.exports = User;
