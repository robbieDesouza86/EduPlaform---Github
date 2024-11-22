const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
    timezone: '+00:00', // Set the timezone to UTC
    define: {
      timestamps: true,
      underscored: true,
    },
  }
);

async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

module.exports = { sequelize, connectToDatabase };