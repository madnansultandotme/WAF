// src/controllers/playerController.js
const Player = require('../models/Player');
const { validationResult } = require('express-validator');
const cricketAPI = require('../utils/ApiService');

const getAllPlayers = async (req, res) => {
    try {
        const players = await Player.find().sort('name');
        res.render('players', { 
            title: 'All Players',
            players 
        });
    } catch (error) {
        res.status(500).render('error', { 
            title: 'Error',
            error: 'Error fetching players' 
        });
    }
};

const getPlayerById = async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);
        if (!player) {
            return res.status(404).render('error', { 
                title: 'Not Found',
                error: 'Player not found' 
            });
        }
        
        // Fetch additional stats from API
        const stats = await cricketAPI.getPlayerStats(req.params.id);
        
        res.render('playerDetail', { 
            title: player.name,
            player,
            stats 
        });
    } catch (error) {
        res.status(500).render('error', { 
            title: 'Error',
            error: 'Error fetching player details' 
        });
    }
};

const searchPlayers = async (req, res) => {
    try {
        const { query } = req.query;
        const players = await Player.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { team: { $regex: query, $options: 'i' } }
            ]
        }).limit(10);
        
        res.render('searchResults', { 
            title: 'Search Results',
            query,
            players 
        });
    } catch (error) {
        res.status(500).render('error', { 
            title: 'Error',
            error: 'Error searching players' 
        });
    }
};

module.exports = {
    getAllPlayers,
    getPlayerById,
    searchPlayers
};
