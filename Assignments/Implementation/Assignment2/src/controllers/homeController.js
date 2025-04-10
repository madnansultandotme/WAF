// src/controllers/homeController.js
const Match = require('../models/Match');
const Series = require('../models/Series');
const Team = require('../models/Team');

const getHomePage = async (req, res) => {
    try {
        // Fetch recent events for homepage
        const liveMatches = await Match.find({ status: 'Live' })
            .populate('teams.team1')
            .populate('teams.team2')
            .limit(3);

        const upcomingSeries = await Series.find({ 
            status: 'Upcoming',
            startDate: { $gte: new Date() }
        })
        .populate('teams')
        .limit(5);

        const recentResults = await Match.find({ status: 'Completed' })
            .populate('teams.team1')
            .populate('teams.team2')
            .sort('-date')
            .limit(5);

        const topTeams = await Team.find()
            .sort({ 'ranking.t20': 1 })
            .limit(5);

        res.render('home', {
            title: 'Cricket Dashboard',
            liveMatches,
            upcomingSeries,
            recentResults,
            topTeams
        });
    } catch (error) {
        res.status(500).render('error', {
            title: 'Error',
            error: 'Error loading homepage'
        });
    }
};

module.exports = {
    getHomePage
};