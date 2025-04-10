// src/routes/seriesRoute.js
const express = require('express');
const router = express.Router();
const seriesController = require('../controllers/seriesController');

router.get('/', seriesController.getAllSeries);
router.get('/:id', seriesController.getSeriesById);
// router.get('/upcoming', seriesController.getUpcomingSeries);
// router.get('/ongoing', seriesController.getOngoingSeries);
// router.get('/completed', seriesController.getCompletedSeries);

module.exports = router;