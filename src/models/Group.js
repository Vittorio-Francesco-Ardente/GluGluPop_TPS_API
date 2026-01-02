const { DataTypes } = require('sequelize');
const crypto = require('crypto');
const { sequelize } = require('../config/database');

const Group = sequelize.define('Group', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [1, 50],
        msg: 'Nome gruppo massimo 50 caratteri'
      }
    }
  },
  code: {
    type: DataTypes.STRING(6),
    unique: true
  },
  creatorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'voting', 'completed'),
    defaultValue: 'active'
  },
  expiresAt: {
    type: DataTypes.DATE,
    defaultValue: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 ore
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: (group) => {
      if (!group.code) {
        group.code = crypto.randomBytes(3).toString('hex').toUpperCase();
      }
    }
  }
});

module.exports = Group;