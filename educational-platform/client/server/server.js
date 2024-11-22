const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize, connectToDatabase } = require('./config/database');
const path = require('path');

const app = express();

// Add this line to use CORS middleware
app.use(cors());

// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Connect to MySQL and sync models
connectToDatabase()
  .then(() => {
    console.log('MySQL connected');
    return removeRedundantIndexes();
  })
  .then(() => {
    return sequelize.sync({ alter: false }); // Changed to false to prevent auto-altering
  })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('MySQL connection error:', err);
    process.exit(1);
  });

// Add error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

// Routes
const authRouter = require('./routes/auth');
const teacherRouter = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');
app.use('/api/auth', authRouter);
app.use('/api/teacher', teacherRouter);
app.use('/api/student', studentRoutes);

// Add this near the top of your route definitions
app.get('/', (req, res) => {
  res.send('Welcome to the Educational Platform API');
});

// Update your test-db route
app.get('/test-db', async (req, res) => {
  try {
    const [result] = await sequelize.query('SELECT 1 + 1 AS result');
    res.json({ message: 'Database test successful', result: result[0].result });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ error: 'Database test failed', details: error.message });
  }
});

// New route to describe the users table
app.get('/describe-users', async (req, res) => {
  try {
    const [result] = await sequelize.query('DESCRIBE Users');
    res.json(result);
  } catch (error) {
    console.error('Error describing users table:', error);
    res.status(500).json({ error: 'Failed to describe users table', details: error.message });
  }
});

// Add this new route
app.get('/show-indexes', async (req, res) => {
  try {
    const [result] = await sequelize.query('SHOW INDEX FROM Users');
    res.json(result);
  } catch (error) {
    console.error('Error showing indexes:', error);
    res.status(500).json({ error: 'Failed to show indexes', details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

async function removeRedundantIndexes() {
  try {
    const [indexes] = await sequelize.query('SHOW INDEX FROM Users WHERE Column_name = "email"');
    const indexesToRemove = indexes
      .filter(index => index.Key_name !== 'PRIMARY' && index.Key_name !== 'email')
      .map(index => index.Key_name);

    if (indexesToRemove.length > 0) {
      const dropIndexQueries = indexesToRemove.map(indexName => `DROP INDEX \`${indexName}\``).join(', ');
      await sequelize.query(`ALTER TABLE Users ${dropIndexQueries}`);
      console.log('Redundant indexes removed successfully');
    } else {
      console.log('No redundant indexes found');
    }

    // Ensure there's only one unique index on the email column
    await sequelize.query('ALTER TABLE Users ADD UNIQUE INDEX `unique_email` (`email`)');
    console.log('Unique email index ensured');
  } catch (error) {
    console.error('Error managing indexes:', error);
  }
}
