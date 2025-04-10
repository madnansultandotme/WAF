// src/routes/scoreRoute.js
const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');

router.get('/', scoreController.getScoreboard);
router.get('/match/:id', scoreController.getMatchDetails);
router.get('/live', scoreController.getLiveScores);
router.get('/upcoming', scoreController.getUpcomingMatches);
router.get('/recent', scoreController.getRecentMatches);

module.exports = router;