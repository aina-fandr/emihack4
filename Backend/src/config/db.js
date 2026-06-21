const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'transport_db',
  process.env.DB_USER || 'neva',
  process.env.DB_PASSWORD || 'aina2006',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Sequelize connecté à PostgreSQL');
  } catch (error) {
    console.error('❌ Impossible de connecter Sequelize à PostgreSQL :', error.message);
  }
};

testConnection();

module.exports = { sequelize };