// src/models/Player.js
const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    team: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper']
    },
    battingStyle: String,
    bowlingStyle: String,
    dateOfBirth: Date,
    nationality: String,
    matches: {
        test: { type: Number, default: 0 },
        odi: { type: Number, default: 0 },
        t20: { type: Number, default: 0 }
    },
    stats: {
        batting: {
            runs: { type: Number, default: 0 },
            average: { type: Number, default: 0 },
            strikeRate: { type: Number, default: 0 },
            hundreds: { type: Number, default: 0 },
            fifties: { type: Number, default: 0 }
        },
        bowling: {
            wickets: { type: Number, default: 0 },
            average: { type: Number, default: 0 },
            economy: { type: Number, default: 0 },
            fiveWickets: { type: Number, default: 0 }
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Player', playerSchema);