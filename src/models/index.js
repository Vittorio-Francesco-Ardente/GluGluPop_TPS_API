const { sequelize } = require('../config/database');
const User = require('./User');
const Swipe = require('./Swipe');
const Group = require('./Group');
const GroupMember = require('./GroupMember');
const GroupVote = require('./GroupVote');
const WatchHistory = require('./WatchHistory');

// ============================================
// RELAZIONI TRA TABELLE
// ============================================

// User -> Swipes (1 utente ha molti swipe)
User.hasMany(Swipe, { foreignKey: 'userId', as: 'swipes' });
Swipe.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User -> WatchHistory
User.hasMany(WatchHistory, { foreignKey: 'userId', as: 'watchHistory' });
WatchHistory.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User -> Groups (creatore)
User.hasMany(Group, { foreignKey: 'creatorId', as: 'createdGroups' });
Group.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });

// Group <-> User (molti a molti tramite GroupMember)
Group.belongsToMany(User, { through: GroupMember, foreignKey: 'groupId', as: 'members' });
User.belongsToMany(Group, { through: GroupMember, foreignKey: 'userId', as: 'groups' });

// Group -> GroupVotes
Group.hasMany(GroupVote, { foreignKey: 'groupId', as: 'votes' });
GroupVote.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });

// User -> GroupVotes
User.hasMany(GroupVote, { foreignKey: 'userId', as: 'groupVotes' });
GroupVote.belongsTo(User, { foreignKey: 'userId', as: 'voter' });

// GroupMember relazioni esplicite
GroupMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });
GroupMember.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });

// ============================================
// SYNC DATABASE
// ============================================
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Tutti i models sincronizzati');
  } catch (error) {
    console.error('❌ Errore sync models:', error.message);
  }
};

module.exports = {
  sequelize,
  User,
  Swipe,
  Group,
  GroupMember,
  GroupVote,
  WatchHistory,
  syncDatabase
};