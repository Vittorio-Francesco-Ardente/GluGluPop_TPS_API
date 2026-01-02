const { Group, GroupMember, GroupVote, User } = require('../models');
const { Op } = require('sequelize');

// ============================================
// CREA NUOVO GRUPPO
// POST /api/groups
// ============================================
exports.createGroup = async (req, res, next) => {
  try {
    const { name } = req.body;
    const creatorId = req.user.id;

    // Crea gruppo
    const group = await Group.create({
      name,
      creatorId
    });

    // Aggiungi creatore come membro
    await GroupMember.create({
      groupId: group.id,
      userId: creatorId
    });

    res.status(201).json({
      success: true,
      message: 'Gruppo creato! 🎉',
      data: {
        group: {
          id: group.id,
          name: group.name,
          code: group.code,
          status: group.status
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// UNISCITI A GRUPPO CON CODICE
// POST /api/groups/join
// ============================================
exports.joinGroup = async (req, res, next) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;

    // Trova gruppo
    const group = await Group.findOne({
      where: { 
        code: code.toUpperCase(),
        status: 'active'
      },
      include: [{
        model: User,
        as: 'members',
        attributes: ['id', 'username', 'avatar']
      }]
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Gruppo non trovato o scaduto'
      });
    }

    // Controlla se già membro
    const existingMember = await GroupMember.findOne({
      where: { groupId: group.id, userId }
    });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'Sei già membro di questo gruppo'
      });
    }

    // Controlla limite membri (max 8)
    const memberCount = await GroupMember.count({
      where: { groupId: group.id }
    });

    if (memberCount >= 8) {
      return res.status(400).json({
        success: false,
        message: 'Gruppo pieno (max 8 membri)'
      });
    }

    // Aggiungi membro
    await GroupMember.create({
      groupId: group.id,
      userId
    });

    // Ricarica gruppo con membri aggiornati
    const updatedGroup = await Group.findByPk(group.id, {
      include: [{
        model: User,
        as: 'members',
        attributes: ['id', 'username', 'avatar']
      }]
    });

    res.status(200).json({
      success: true,
      message: 'Ti sei unito al gruppo! 🎬',
      data: { group: updatedGroup }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// OTTIENI DETTAGLI GRUPPO
// GET /api/groups/:id
// ============================================
exports.getGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const group = await Group.findByPk(id, {
      include: [
        {
          model: User,
          as: 'members',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'avatar']
        }
      ]
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Gruppo non trovato'
      });
    }

    // Controlla se è membro
    const isMember = await GroupMember.findOne({
      where: { groupId: id, userId }
    });

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Non sei membro di questo gruppo'
      });
    }

    res.status(200).json({
      success: true,
      data: { group }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// VOTA UN FILM NEL GRUPPO
// POST /api/groups/:id/vote
// ============================================
exports.voteMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { movieId, movieTitle, moviePoster, vote } = req.body;
    const userId = req.user.id;

    // Verifica gruppo esiste
    const group = await Group.findByPk(id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Gruppo non trovato'
      });
    }

    // Verifica è membro
    const isMember = await GroupMember.findOne({
      where: { groupId: id, userId }
    });

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Non sei membro di questo gruppo'
      });
    }

    // Crea o aggiorna voto
    const [groupVote, created] = await GroupVote.upsert({
      groupId: id,
      userId,
      movieId,
      movieTitle,
      moviePoster,
      vote
    }, {
      returning: true
    });

    // Conta voti per questo film
    const totalMembers = await GroupMember.count({
      where: { groupId: id }
    });

    const votesForMovie = await GroupVote.findAll({
      where: { groupId: id, movieId }
    });

    const allVoted = votesForMovie.length === totalMembers;
    const allLiked = votesForMovie.every(v => v.vote === 'like');
    const isMatch = allVoted && allLiked;

    res.status(200).json({
      success: true,
      message: isMatch ? '🎉 MATCH! Tutti hanno messo like!' : 'Voto registrato! ✅',
      data: {
        isMatch,
        votesCount: votesForMovie.length,
        totalMembers,
        votes: votesForMovie.map(v => ({
          oderId: v.userId,
          vote: v.vote
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// OTTIENI MATCHES DEL GRUPPO
// GET /api/groups/:id/matches
// ============================================
exports.getMatches = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Conta membri
    const totalMembers = await GroupMember.count({
      where: { groupId: id }
    });

    // Trova tutti i voti del gruppo
    const allVotes = await GroupVote.findAll({
      where: { groupId: id }
    });

    // Raggruppa per movieId
    const movieVotes = {};
    allVotes.forEach(vote => {
      if (!movieVotes[vote.movieId]) {
        movieVotes[vote.movieId] = {
          movieId: vote.movieId,
          movieTitle: vote.movieTitle,
          moviePoster: vote.moviePoster,
          votes: []
        };
      }
      movieVotes[vote.movieId].votes.push(vote);
    });

    // Trova matches (tutti like)
    const matches = Object.values(movieVotes).filter(movie => {
      return movie.votes.length === totalMembers &&
             movie.votes.every(v => v.vote === 'like');
    });

    res.status(200).json({
      success: true,
      data: {
        matches: matches.map(m => ({
          movieId: m.movieId,
          movieTitle: m.movieTitle,
          moviePoster: m.moviePoster
        })),
        totalMembers
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// OTTIENI I MIEI GRUPPI
// GET /api/groups
// ============================================
exports.getMyGroups = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Trova gruppi dove sono membro
    const memberships = await GroupMember.findAll({
      where: { userId },
      include: [{
        model: Group,
        as: 'group',
        where: { status: { [Op.ne]: 'completed' } },
        include: [
          {
            model: User,
            as: 'members',
            attributes: ['id', 'username', 'avatar']
          },
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'username']
          }
        ]
      }]
    });

    const groups = memberships
      .map(m => m.group)
      .filter(g => g !== null);

    res.status(200).json({
      success: true,
      data: { groups }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ESCI DA UN GRUPPO
// DELETE /api/groups/:id/leave
// ============================================
exports.leaveGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const group = await Group.findByPk(id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Gruppo non trovato'
      });
    }

    // Non può uscire il creatore
    if (group.creatorId === userId) {
      return res.status(400).json({
        success: false,
        message: 'Il creatore non può abbandonare il gruppo. Elimina il gruppo.'
      });
    }

    // Rimuovi membro
    await GroupMember.destroy({
      where: { groupId: id, userId }
    });

    // Rimuovi anche i voti
    await GroupVote.destroy({
      where: { groupId: id, userId }
    });

    res.status(200).json({
      success: true,
      message: 'Hai lasciato il gruppo 👋'
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ELIMINA GRUPPO (solo creatore)
// DELETE /api/groups/:id
// ============================================
exports.deleteGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const group = await Group.findByPk(id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Gruppo non trovato'
      });
    }

    if (group.creatorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Solo il creatore può eliminare il gruppo'
      });
    }

    // Elimina tutto
    await GroupVote.destroy({ where: { groupId: id } });
    await GroupMember.destroy({ where: { groupId: id } });
    await group.destroy();

    res.status(200).json({
      success: true,
      message: 'Gruppo eliminato! 🗑️'
    });
  } catch (error) {
    next(error);
  }
};