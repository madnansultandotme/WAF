// src/models/Match.js
const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    series: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Series',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    venue: {
        name: String,
        city: String,
        country: String
    },
    teams: {
        team1: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team',
            required: true
        },
        team2: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team',
            required: true
        }
    },
    score: {
        team1: {
            runs: { type: Number, default: 0 },
            wickets: { type: Number, default: 0 },
            overs: { type: Number, default: 0 }
        },
        team2: {
            runs: { type: Number, default: 0 },
            wickets: { type: Number, default: 0 },
            overs: { type: Number, default: 0 }
        }
    },
    status: {
        type: String,
        enum: ['Upcoming', 'Live', 'Completed'],
        default: 'Upcoming'
    },
    result: String,
    matchType: {
        type: String,
        enum: ['Test', 'ODI', 'T20'],
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Match', matchSchema);