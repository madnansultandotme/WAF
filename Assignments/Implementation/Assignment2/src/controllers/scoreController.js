// src/controllers/scoreController.js
const Match = require('../models/Match');
const cricketAPI = require('../utils/ApiService');

const getScoreboard = async (req, res) => {
    try {
        const liveMatches = await Match.find({ status: 'Live' })
            .populate('teams.team1')
            .populate('teams.team2')
            .sort('-date');

        const recentMatches = await Match.find({ status: 'Completed' })
            .populate('teams.team1')
            .populate('teams.team2')
            .sort('-date')
            .limit(5);

        const upcomingMatches = await Match.find({ status: 'Upcoming' })
            .populate('teams.team1')
            .populate('teams.team2')
            .sort('date')
            .limit(5);

        res.render('scoreboard', {
            title: 'Live Scoreboard',
            liveMatches,
            recentMatches,
            upcomingMatches
        });
    } catch (error) {
        res.status(500).render('error', {
            title: 'Error',
            error: 'Error fetching scoreboard'
        });
    }
};

const getMatchDetails = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id)
            .populate('teams.team1')
            .populate('teams.team2')
            .populate('series');

        if (!match) {
            return res.status(404).render('error', {
                title: 'Not Found',
                error: 'Match not found'
            });
        }

        res.render('matchDetail', {
            title: `${match.teams.team1.name} vs ${match.teams.team2.name}`,
            match
        });
    } catch (error) {
        res.status(500).render('error', {
            title: 'Error',
            error: 'Error fetching match details'
        });
    }
};
const getLiveScores = async (req, res) => {
    try {
        const matches = await Match.find({ status: 'Live' })
            .populate('teams.team1')
            .populate('teams.team2');
        res.json(matches);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching live scores' });
    }
};

const getUpcomingMatches = async (req, res) => {
    try {
        const matches = await Match.find({ status: 'Upcoming' })
            .populate('teams.team1')
            .populate('teams.team2')
            .sort('date');
        res.json(matches);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching upcoming matches' });
    }
};

const getRecentMatches = async (req, res) => {
    try {
        const matches = await Match.find({ status: 'Completed' })
            .populate('teams.team1')
            .populate('teams.team2')
            .sort('-date');
        res.json(matches);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching recent matches' });
    }
};

module.exports = {
    getScoreboard,
    getMatchDetails,
    getLiveScores,
    getUpcomingMatches,
    getRecentMatches
};