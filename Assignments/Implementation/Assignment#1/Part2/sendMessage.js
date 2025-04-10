const axios = require('axios');

// Function to send SMS
const sendSMS = async (recipients, messageContent) => {
    const options = {
        method: 'POST',
        url: 'https://d7sms.p.rapidapi.com/messages/v1/send',
        headers: {
            'x-rapidapi-key': '359fb979d3msh757b5d64ee46e5dp1fa813jsnb309e0ebeadf',
            'x-rapidapi-host': 'd7sms.p.rapidapi.com',
            'Content-Type': 'application/json',
            Token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoLWJhY2tlbmQ6YXBwIiwic3ViIjoiNWFhMDRjMGEtMDU4My00ZjEyLTllODEtNDUyY2EwZGFmMzUxIn0.7aXdT_Eu51IRFysKToJoctTqD3J-T15Ze36LVlYYmNc' // Use an environment variable for the token
        },
        data: {
            messages: [
                {
                    channel: 'sms',
                    originator: 'D7-RapidAPI',
                    recipients: recipients, // Array of recipients
                    content: messageContent, // Message content
                    data_coding: 'text'
                }
            ]
        }
    };

    try {
        console.log('Sending SMS to recipients:', recipients);
        const response = await axios.request(options);
        console.log('SMS sent successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending SMS:', error.response?.data || error.message);
        throw error;
    }
};

// Example usage
(async () => {
    const recipients = ['+923053164869']; // Replace with valid numbers
    const message = 'Greetings from D7 API. Stay safe and informed!.I am Muhammad Adnan Sultan from Pakistan'; // Message content

    try {
        const result = await sendSMS(recipients, message);
        console.log('Result:', result);
    } catch (error) {
        console.error('Failed to send SMS:', error);
    }
})();
