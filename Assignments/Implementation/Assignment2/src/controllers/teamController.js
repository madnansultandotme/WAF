// src/controllers/teamController.js
const Team = require('../models/Team');
const Player = require('../models/Player');
const Match = require('../models/Match');
const CricketAPI = require('../utils/ApiService');

const getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find()
            .populate('captain')
            .sort('ranking.t20');

        res.render('teams/index', {
            title: 'Cricket Teams',
            teams
        });
    } catch (error) {
        res.status(500).render('error', {
            title: 'Error',
            error: 'Error fetching teams'
        });
    }
};

const getTeamById = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id)
            .populate('players')
            .populate('captain');

        if (!team) {
            return res.status(404).render('error', {
                title: 'Not Found',
                error: 'Team not found'
            });
        }

        res.render('teams/detail', {
            title: team.name,
            team
        });
    } catch (error) {
        res.status(500).render('error', {
            title: 'Error',
            error: 'Error fetching team details'
        });
    }
};

// Get all players for a specific team
const getTeamPlayers = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id).populate('players');
        if (!team) {
            return res.status(404).render('error', {
                title: 'Not Found',
                error: 'Team not found'
            });
        }
        res.render('teams/players', {
            title: `${team.name} Players`,
            players: team.players
        });
    } catch (error) {
        res.status(500).render('error', {
            title: 'Error',
            error: 'Error fetching team players'
        });
    }
};

// Get all matches for a specific team
const getTeamMatches = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id).populate('matches');
        if (!team) {
            return res.status(404).render('error', {
                title: 'Not Found',
                error: 'Team not found'
            });
        }
        res.render('teams/matches', {
            title: `${team.name} Matches`,
            matches: team.matches
        });
    } catch (error) {
        res.status(500).render('error', {
            title: 'Error',
            error: 'Error fetching team matches'
        });
    }
};

// Get rankings for a specific team
const getTeamRankings = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) {
            return res.status(404).render('error', {
                title: 'Not Found',
                error: 'Team not found'
            });
        }
        res.render('teams/rankings', {
            title: `${team.name} Rankings`,
            rankings: team.ranking
        });
    } catch (error) {
        res.status(500).render('error', {
            title: 'Error',
            error: 'Error fetching team rankings'
        });
    }
};

module.exports = {
    getAllTeams,
    getTeamById,
    getTeamPlayers,
    getTeamMatches,
    getTeamRankings
};
