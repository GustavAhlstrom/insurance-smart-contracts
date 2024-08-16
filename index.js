require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Weather API Route (Using Open-Meteo)
app.post('/weather', async (req, res) => {
    const { id, data } = req.body;
    const location = data.location || 'San Francisco';

    // Example latitude and longitude for New York; replace with actual logic to determine based on location
    const latitude = 40.7128;
    const longitude = -74.0060;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    try {
        const response = await axios.get(url);
        const temperature = response.data.current_weather.temperature;

        res.json({
            jobRunID: id,
            data: { temperature },
            statusCode: 200,
        });
    } catch (error) {
        res.status(500).json({
            jobRunID: id,
            status: "errored",
            error: error.message,
        });
    }
});

// Health API Route (Using COVID-API)
app.post('/health', async (req, res) => {
    const { id, data } = req.body;
    const query = data.query || 'COVID-19';
    const country = data.country || 'US';  // Specify the country if needed

    const url = `https://covid-api.com/api/reports?iso=${country}`;

    try {
        const response = await axios.get(url);
        const report = response.data.data[0];  // Assuming you want the first report in the array

        res.json({
            jobRunID: id,
            data: { report },
            statusCode: 200,
        });
    } catch (error) {
        res.status(500).json({
            jobRunID: id,
            status: "errored",
            error: error.message,
        });
    }
});

// Financial API Route (Using Alpha Vantage)
app.post('/financial', async (req, res) => {
    const { id, data } = req.body;
    const apiKey = process.env.FINANCIAL_API_KEY;  // Set this in your environment
    const symbol = data.symbol || 'AAPL';

    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`;

    try {
        const response = await axios.get(url);
        const timeSeries = response.data['Time Series (5min)'];
        const latestTimestamp = Object.keys(timeSeries)[0];
        const price = timeSeries[latestTimestamp]['1. open'];

        res.json({
            jobRunID: id,
            data: { price },
            statusCode: 200,
        });
    } catch (error) {
        res.status(500).json({
            jobRunID: id,
            status: "errored",
            error: error.message,
        });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

