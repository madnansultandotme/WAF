const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();



const connectDB = require('./config/database');
const winston = require('winston');

// Import Routes
const homeRouter = require('./routes/homeRoute');
const scoreRouter = require('./routes/scoreRoute');
const seriesRouter = require('./routes/seriesRoute');
const teamRouter = require('./routes/teamRoute');
const playerRouter = require('./routes/playerRoute');

const app = express();
app.use((req, res, next) => {
    res.locals.path = req.path; // Makes `path` available in EJS templates
    next();
});
// Configure Winston Logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/app.log' })
    ]
});

// Connect to database
connectDB().then(() => logger.info('Database connection established'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');

// Routes
app.use('/', homeRouter);
app.use('/scoreboard', scoreRouter);
app.use('/series', seriesRouter);
app.use('/teams', teamRouter);
app.use('/players', playerRouter);

// 404 Handler
app.use((req, res) => {
    logger.warn(`404 - Not Found - ${req.originalUrl}`);
    res.status(404).render('error', {
        title: '404 - Not Found',
        error: 'The page you are looking for does not exist.'
    });
});

// Error Handler
app.use((err, req, res, next) => {
    logger.error(`500 - Server Error - ${err.message}`);
    res.status(500).render('error', { 
        title: '500 - Server Error',
        error: 'Something went wrong!' 
    });
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
