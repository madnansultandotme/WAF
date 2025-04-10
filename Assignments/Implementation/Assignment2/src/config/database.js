// src/config/database.js

require('dotenv').config();
const mongoose = require('mongoose');
const winston = require('winston');

// Configure Winston Logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
    ),
    transports: [
        new winston.transports.Console(), // Log to console
        new winston.transports.File({ filename: 'logs/database.log' }) // Log to a file
    ]
});

// Validate MONGODB_URI
if (!process.env.MONGODB_URI) {
    logger.error('MONGODB_URI is not set in environment variables.');
    process.exit(1); // Exit the application
}

// MongoDB Connection Function
const connectDB = async () => {
    const maxRetries = 5; // Maximum retry attempts
    let attempts = 0;

    while (attempts < maxRetries) {
        try {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });

            logger.info('MongoDB connected successfully');
            break; // Exit loop on successful connection
        } catch (error) {
            attempts++;
            logger.error(`MongoDB connection attempt ${attempts} failed. Error: ${error.message}`);

            if (attempts === maxRetries) {
                logger.error('Max connection attempts reached. Exiting application.');
                process.exit(1); // Exit if all retries fail
            }

            // Retry after 5 seconds
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};

// Handle MongoDB Events
mongoose.connection.on('connected', () => {
    logger.info('Mongoose connection established');
});

mongoose.connection.on('error', error => {
    logger.error(`Mongoose connection error: ${error.message}`);
});

mongoose.connection.on('disconnected', () => {
    logger.warn('Mongoose connection disconnected');
});

// Export the connection function
module.exports = connectDB;
