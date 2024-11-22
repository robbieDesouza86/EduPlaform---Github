const { sequelize } = require('../config/database');

async function executeQuery(sql, params = []) {
  try {
    const [results] = await sequelize.query(sql, {
      replacements: params,
      type: sequelize.QueryTypes.SELECT
    });
    return results;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

module.exports = { executeQuery };