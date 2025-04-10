// src/models/Team.js
const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    country: {
        type: String,
        required: true
    },
    ranking: {
        test: Number,
        odi: Number,
        t20: Number
    },
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    }],
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    },
    coach: {
        name: String,
        nationality: String
    },
    statistics: {
        matches: {
            total: { type: Number, default: 0 },
            won: { type: Number, default: 0 },
            lost: { type: Number, default: 0 },
            drawn: { type: Number, default: 0 }
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Team', teamSchema);
