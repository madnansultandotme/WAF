// src/routes/playerRoute.js
const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const { playerValidation } = require('../middleware/validation');

router.get('/', playerController.getAllPlayers);
router.get('/search', playerController.searchPlayers);
router.get('/:id', playerController.getPlayerById);

module.exports = router;