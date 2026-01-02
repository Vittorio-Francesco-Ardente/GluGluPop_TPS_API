const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Swipe = sequelize.define('Swipe', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  movieId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  movieTitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  moviePoster: {
    type: DataTypes.STRING,
    allowNull: true
  },
  movieGenres: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const value = this.getDataValue('movieGenres');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('movieGenres', JSON.stringify(value || []));
    }
  },
  action: {
    type: DataTypes.ENUM('like', 'skip', 'superlike'),
    allowNull: false
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'movieId']
    }
  ]
});

module.exports = Swipe;