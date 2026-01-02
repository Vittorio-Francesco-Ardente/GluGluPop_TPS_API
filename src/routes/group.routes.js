const express = require('express');
const router = express.Router();
const {
  createGroup,
  joinGroup,
  getGroup,
  voteMovie,
  getMatches,
  getMyGroups,
  leaveGroup,
  deleteGroup
} = require('../controllers/groupController');
const { protect } = require('../middlewares/authMiddleware');
const { validate, schemas } = require('../middlewares/validateRequest');

// Tutte le rotte richiedono autenticazione
router.use(protect);

router.get('/', getMyGroups);
router.post('/', validate(schemas.createGroup), createGroup);
router.post('/join', joinGroup);
router.get('/:id', getGroup);
router.post('/:id/vote', validate(schemas.groupVote), voteMovie);
router.get('/:id/matches', getMatches);
router.delete('/:id/leave', leaveGroup);
router.delete('/:id', deleteGroup);

module.exports = router;