// src/utils/apiService.js
const axios = require('axios');

class CricketAPI {
    constructor() {
        this.apiKey = process.env.CRICKET_API_KEY;
        this.baseURL = 'https://api.cricketdata.org/v1';
    }

    async getMatches() {
        try {
            const response = await axios.get(`${this.baseURL}/matches`, {
                headers: { 'Authorization': `Bearer ${this.apiKey}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching matches:', error);
            throw error;
        }
    }

    async getPlayerStats(playerId) {
        try {
            const response = await axios.get(`${this.baseURL}/players/${playerId}`, {
                headers: { 'Authorization': `Bearer ${this.apiKey}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching player stats:', error);
            throw error;
        }
    }
}

module.exports = new CricketAPI();
