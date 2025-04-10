// src/models/Series.js
const mongoose = require('mongoose');

const seriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    format: {
        type: String,
        enum: ['Test', 'ODI', 'T20'],
        required: true
    },
    teams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    }],
    status: {
        type: String,
        enum: ['Upcoming', 'Ongoing', 'Completed'],
        default: 'Upcoming'
    },
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    matches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Series', seriesSchema);