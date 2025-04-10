// src/routes/teamRoute.js
const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

router.get('/', teamController.getAllTeams);
router.get('/:id', teamController.getTeamById);
router.get('/:id/players', teamController.getTeamPlayers);
router.get('/:id/matches', teamController.getTeamMatches);
router.get('/rankings/:format', teamController.getTeamRankings);

module.exports = router;