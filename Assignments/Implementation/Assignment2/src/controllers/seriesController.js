// src/controllers/seriesController.js
const Series = require('../models/Series');
const cricketAPI = require('../utils/ApiService');

const getAllSeries = async (req, res) => {
    try {
        // First fetch from API
        const apiSeries = await cricketAPI.fetchAllSeries();
        
        // Store or update in database
        for (const seriesData of apiSeries) {
            await Series.findOneAndUpdate(
                { apiId: seriesData.id }, // assuming there's an apiId field
                seriesData,
                { upsert: true, new: true }
            );
        }

        // Then fetch from database
        const series = await Series.find()
            .populate('teams')
            .sort('-startDate');
        
        res.render('series/index', {
            title: 'Cricket Series',
            series
        });
    } catch (error) {
        res.status(500).render('error', {
            title: 'Error',
            error: 'Error fetching series data'
        });
    }
};

const getSeriesById = async (req, res) => {
    try {
        // First fetch from API
        const apiSeriesData = await cricketAPI.fetchSeriesById(req.params.id);
        
        // Update or insert in database
        await Series.findOneAndUpdate(
            { apiId: req.params.id },
            apiSeriesData,
            { upsert: true, new: true }
        );

        // Then fetch from database with populated fields
        const series = await Series.findOne({ apiId: req.params.id })
            .populate('teams')
            .populate('matches')
            .populate('winner');
        
        if (!series) {
            return res.status(404).render('error', {
                title: 'Not Found',
                error: 'Series not found'
            });
        }

        res.render('series/detail', {
            title: series.name,
            series
        });
    } catch (error) {
        res.status(500).render('error', {
            title: 'Error',
            error: 'Error fetching series details'
        });
    }
};

module.exports = {
    getAllSeries,
    getSeriesById
};