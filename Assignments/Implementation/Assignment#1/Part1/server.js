// Required dependencies
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const logger = require('./logger');
const morgan = require('morgan');
const fs = require('fs');

const path = require('path');

const app = express();
const port = 3000;
// Create logs directory if it doesn't exist
if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
}

// HTTP request logging
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'logs', 'access.log'),
    { flags: 'a' }
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: accessLogStream }));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/university-explorer', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    logger.info('Successfully connected to MongoDB.');
}).catch((err) => {
    logger.error('MongoDB connection error:', err);
});
const capitalCities = {
    'Pakistan': 'Islamabad',
    'India': 'New Delhi',
    'China': 'Beijing',
    'USA': 'Washington',
    'UK': 'London'
};

// University Schema
const universitySchema = new mongoose.Schema({
    name: String,
    country: String,
    web_pages: [String],
    isCapitalCity: { type: Boolean, default: false }
}, {
    timestamps: true // Add timestamps for tracking document changes
});

// Create models for different countries
const University = mongoose.model('University', universitySchema);
const PakistanUniversity = mongoose.model('PakistanUniversity', universitySchema);
const IndiaUniversity = mongoose.model('IndiaUniversity', universitySchema);
const ChinaUniversity = mongoose.model('ChinaUniversity', universitySchema);
const USAUniversity = mongoose.model('USAUniversity', universitySchema);
const UKUniversity = mongoose.model('UKUniversity', universitySchema);

// Routes for HTML forms
app.get('/see_country_universities', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'country-universities.html'));
});

app.get('/search_university', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'search-university.html'));
});

// API Routes
app.get('/api/universities/:country', async (req, res) => {
    try {
        logger.info(`Searching universities for country: ${country}`);
        const response = await axios.get(
            `http://universities.hipolabs.com/search?country=${req.params.country}`
        );
        const universities = response.data;
        logger.info(`Found ${universities.length} universities for ${country}`);
        res.json({
            count: universities.length,
            universities: universities.map(uni => uni.name)
        });
    } catch (error) {
        logger.error(`Failed to fetch universities for ${country}:`, error);
        res.status(500).json({ error: 'Failed to fetch universities' });
    }
});

// Updated route for searching universities by name
app.get('/api/university/:name', async (req, res) => {
    try {
        logger.info(`Searching for university: ${universityName}`);
        const universityName = decodeURIComponent(req.params.name);
        const response = await axios.get(
            `http://universities.hipolabs.com/search?name=${encodeURIComponent(universityName)}`
        );
        
        if (response.data && response.data.length > 0) {
            const university = response.data[0];
            logger.info(`Found university: ${university.name}`);
            res.json({
                name: university.name,
                webPages: university.web_pages
            });
        } else {
            logger.warn(`No university found with name: ${universityName}`);
            res.status(404).json({ error: 'University not found' });
        }
    } catch (error) {
        console.error('Error fetching university:', error);
        logger.error(`Error fetching university ${universityName}:`, error);
        res.status(500).json({ error: 'Failed to fetch university details' });
    }
});

// Updated populateDatabase function
async function populateDatabase() {
    const countries = ['Pakistan', 'India', 'China', 'USA', 'UK'];
    logger.info('Starting database population');
    // Clear existing data
    await University.deleteMany({});
    logger.info('Cleared existing university data');
    for (const country of countries) {
        try {
            logger.info(`Fetching universities for ${country}`);
            const response = await axios.get(
                `http://universities.hipolabs.com/search?country=${country}`
            );
            
            // Process universities to mark those in capital cities
            const universities = response.data.map(uni => ({
                ...uni,
                isCapitalCity: uni.name.toLowerCase().includes(capitalCities[country].toLowerCase()) ||
                              (uni.city && uni.city.toLowerCase() === capitalCities[country].toLowerCase())
            }));
            
            // Save to country-specific collection
            const model = mongoose.model(`${country}University`);
            await model.deleteMany({}); // Clear existing data
            await model.insertMany(universities);
            logger.info(`Populated ${universities.length} universities for ${country}`);
            // Save to general collection
            await University.insertMany(universities);
            
            console.log(`Populated database for ${country}`);
        } catch (error) {
            logger.error(`Error populating database for ${country}:`, error);
            console.error(`Error populating database for ${country}:`, error);
        }
    }
}


// CRUD Operations
// Find universities in capitals
app.get('/api/capital-universities', async (req, res) => {
    try {
        logger.info('Fetching universities in capital cities');
        const capitalUniversities = await University.find({ isCapitalCity: true });
        
        logger.info(`Found ${capitalUniversities.length} universities in capital cities`);
        if (capitalUniversities.length === 0) {
            // If no universities found, add some default ones
            logger.warn('No universities found in capital cities, adding default ones');
            const defaultCapitalUniversities = [
                {
                    name: "Quaid-i-Azam  University Islamabad",
                    country: "Pakistan",
                    web_pages: ["http://www.qau.edu.pk"],
                    isCapitalCity: true
                },
                {
                    name: "University of Delhi",
                    country: "India",
                    web_pages: ["http://www.du.ac.in"],
                    isCapitalCity: true
                },
                {
                    name: "Peking University",
                    country: "China",
                    web_pages: ["http://www.pku.edu.cn"],
                    isCapitalCity: true
                },
                {
                    name: "George Washington University",
                    country: "USA",
                    web_pages: ["http://www.gwu.edu"],
                    isCapitalCity: true
                },
                {
                    name: "London School of Economics",
                    country: "UK",
                    web_pages: ["http://www.lse.ac.uk"],
                    isCapitalCity: true
                }
            ];

            await University.insertMany(defaultCapitalUniversities);
            
            res.json(defaultCapitalUniversities);
        } else {
            res.json(capitalUniversities);
        }
    } catch (error) {
        console.error('Error fetching capital universities:', error);
        res.status(500).json({ error: 'Failed to fetch capital universities' });
    }
});

// Add new university
app.post('/api/universities', async (req, res) => {
    try {
        logger.info('Adding new university:', req.body);
        const newUniversity = new University(req.body);
        
        await newUniversity.save();
        
        if (req.body.country === 'Pakistan') {
            const pakUni = new PakistanUniversity(req.body);
            await pakUni.save();
        }
        
        res.json(newUniversity);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add university' });
    }
});

// Delete university
app.delete('/api/universities/:id', async (req, res) => {
    try {
        logger.info(`Deleting university with ID: ${id}`);
        await University.findByIdAndDelete(req.params.id);
        res.json({ message: 'University deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete university' });
    }
});

// Update university
app.put('/api/universities/:id', async (req, res) => {
    try {
        logger.info(`Updating university with ID: ${id}`, req.body);
        const updatedUniversity = await University.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedUniversity);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update university' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    populateDatabase(); // Populate database on server start
});
// Error handling
process.on('unhandledRejection', (error) => {
    logger.error('Unhandled Rejection:', error);
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});