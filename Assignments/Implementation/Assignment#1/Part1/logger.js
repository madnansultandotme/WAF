const winston = require('winston');
const path = require('path');

// Create logs directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
}

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.prettyPrint()
);

// Create logger instance
const logger = winston.createLogger({
    format: logFormat,
    transports: [
        // Console logging
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        // Error logging
        new winston.transports.File({
            filename: path.join(__dirname, 'logs', 'error.log'),
            level: 'error'
        }),
        // Combined logging
        new winston.transports.File({
            filename: path.join(__dirname, 'logs', 'combined.log')
        })
    ]
});

module.exports = logger;