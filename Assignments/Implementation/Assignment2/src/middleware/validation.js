// src/middleware/validation.js
const { check } = require('express-validator');

exports.playerValidation = [
    check('name')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Player name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    check('team')
        .not()
        .isEmpty()
        .withMessage('Team is required'),
    check('role')
        .isIn(['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'])
        .withMessage('Invalid role selected')
];