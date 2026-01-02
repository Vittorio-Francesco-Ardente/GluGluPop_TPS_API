const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const GroupVote = sequelize.define('GroupVote', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false
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
  vote: {
    type: DataTypes.ENUM('like', 'skip'),
    allowNull: false
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['groupId', 'userId', 'movieId']
    }
  ]
});

module.exports = GroupVote;