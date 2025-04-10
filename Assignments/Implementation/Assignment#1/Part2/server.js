require('dotenv').config();
const axios = require('axios');
const nodemailer = require('nodemailer');
const winston = require('winston');
const fs = require('fs');
const cron = require('node-cron');
const path = require('path');

// Configure Winston logger
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        // Console transport
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        // File transport
        new winston.transports.File({
            filename: 'logs/log.txt',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    ]
});

// Create logs directory if it doesn't exist
if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
}

// Email configuration
const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Weather API configuration (7timer)
const getWeatherData = async (lat, lon) => {
    try {
        logger.info('Fetching weather data from 7timer API');
        const response = await axios.get(
            `http://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`
        );
        
        const weatherData = response.data;
        const todayForecast = weatherData.dataseries[0];
        
        logger.info('Successfully fetched weather data', { forecast: todayForecast });
        
        return {
            temperature: todayForecast.temp2m,
            precipitation: todayForecast.prec_type,
            cloudCover: todayForecast.cloudcover,
            willRain: ['rain', 'shower'].includes(todayForecast.prec_type)
        };
    } catch (error) {
        logger.error('Error fetching weather data:', error);
        throw error;
    }
};

const sendSMS = async (message) => {
    try {
        logger.info('Attempting to send SMS notification');
        
        const options = {
            method: 'POST',
            url: 'https://d7sms.p.rapidapi.com/messages/v1/send',
            headers: {
                'x-rapidapi-key': process.env.RAPID_API_KEY,
            'x-rapidapi-host': 'd7sms.p.rapidapi.com',
            'Content-Type': 'application/json',
            Token: process.env.AUTH_TOKEN
        },
            data: {
                messages: [
                    {
                        channel: 'sms',
                        originator: 'Ats Weather',
                        recipients: [process.env.PHONE_NUMBER],
                        content: message,
                        data_coding: 'text'
                    }
                ]
            }
        };
        
        const response = await axios.request(options);
        logger.info('SMS sent successfully', { response: response.data });
        return response.data;
    } catch (error) {
        logger.error('Error sending SMS:', error);
        throw error;
    }
};


// Email sending function
const sendEmail = async (subject, text) => {
    try {
        logger.info('Attempting to send email notification');
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECIPIENT_EMAIL,
            subject: subject,
            text: text
        };
        
        const info = await emailTransporter.sendMail(mailOptions);
        logger.info('Email sent successfully', { messageId: info.messageId });
        return info;
    } catch (error) {
        logger.error('Error sending email:', error);
        throw error;
    }
};

// Function to generate weather message
const generateWeatherMessage = (weatherData) => {
    return `
Weather Update:
Temperature: ${weatherData.temperature}°C
Chance of Rain: ${weatherData.willRain ? 'Yes' : 'No'}
Cloud Cover: ${weatherData.cloudCover}%
${weatherData.willRain ? 'Don\'t forget your umbrella!' : 'Clear skies ahead!'}
    `.trim();
};

// Main notification function
const sendWeatherNotification = async () => {
    try {
        logger.info('Starting weather notification process');
        
        // Get weather data (example coordinates for Islamabad)
        const weatherData = await getWeatherData(33.6844, 73.0479);
        
        // Generate message
        const message = generateWeatherMessage(weatherData);
        
        // Send notifications
        await Promise.all([
            sendEmail('Daily Weather Update', message),
            sendSMS(message)
        ]);
        
        logger.info('Weather notifications sent successfully');
    } catch (error) {
        logger.error('Error in weather notification process:', error);
    }
};

// Schedule daily notification (runs at 7 AM every day)
cron.schedule('0 7 * * *', () => {
    logger.info('Running scheduled weather notification');
    sendWeatherNotification();
});

// Initial run
logger.info('Weather notification system starting');
sendWeatherNotification();