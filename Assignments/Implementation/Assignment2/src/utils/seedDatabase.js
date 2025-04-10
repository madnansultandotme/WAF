// src/utils/seedDatabase.js
const mongoose = require('mongoose');
const Team = require('../models/Team');
const Player = require('../models/Player');
const Match = require('../models/Match');
const Series = require('../models/Series');
require('dotenv').config();

const teams = [
    {
        name: 'India',
        country: 'India',
        ranking: {
            test: 1,
            odi: 2,
            t20: 1
        }
    },
    // Add more teams...
];

const players = [
    {
        name: 'Virat Kohli',
        team: 'India',
        role: 'Batsman',
        battingStyle: 'Right-handed',
        dateOfBirth: new Date('1988-11-05'),
        nationality: 'Indian'
    },
    // Add more players...
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // Clear existing data
        await Team.deleteMany({});
        await Player.deleteMany({});
        await Match.deleteMany({});
        await Series.deleteMany({});

        // Insert new data
        const createdTeams = await Team.insertMany(teams);
        const createdPlayers = await Player.insertMany(players);

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();