const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_STORAGE || './database.sqlite',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    freezeTableName: true
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database SQLite connesso');
    console.log(`📁 File: ${process.env.DB_STORAGE || './database.sqlite'}`);
  } catch (error) {
    console.error('❌ Errore database:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };