require('dotenv').config();
const express = require('express')
const app = express()
const axios = require('axios')
const fs = require('fs');
const path = require('path');
const qs = require('qs');
const { GoogleGenerativeAI } = require("@google/generative-ai");


const PORT = process.env.PORT || 5000;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;

app.get('/auth/instagram', (req, res) => {
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`;
    res.redirect(authUrl);
})

app.get('/auth/callback', async (req, res) => {
    const authorizationCode = req.query.code;
    console.log('authorizationCode', authorizationCode)
    // if (!authorizationCode) {
    //     return res.status(400).send('Authorization code is missing');
    // }
    //
    try {
        const data = qs.stringify({
            client_id: clientId, // Instagram client ID
            client_secret: process.env.CLIENT_SECRET, // Secret from .env
            grant_type: 'authorization_code', // The required grant type
            redirect_uri: process.env.REDIRECT_URI, // Must match the registered redirect URI
            code: authorizationCode, // The code returned from Instagram
        });
        const response = await axios.post('https://api.instagram.com/oauth/access_token', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Ensure correct content type
            }
        });

        // If the access token is received, save it
        if (response.data.access_token) {
            const accessToken = response.data.access_token;
            const userId = response.data.user_id;

            // Save the access token to a file or database
            saveAccessToken(userId, accessToken);

            res.send('Access token saved successfully!');
        } else {
            res.status(500).send('Access token not received');
        }
    } catch (error) {
        // Log the error response from Instagram for further debugging
        console.error('Error exchanging code for access token:', error.response?.data || error.message);
        res.status(500).send('Failed to exchange access token');
    }
});


app.post('/sendQuote', async(req, res)=> {

})

const tokensFilePath = path.join(__dirname, 'tokens.json');

// Function to save the access token to a JSON file
function saveAccessToken(userId, accessToken) {
    let tokens = {};

    // Check if the file exists, and if it does, read it
    if (fs.existsSync(tokensFilePath)) {
        tokens = JSON.parse(fs.readFileSync(tokensFilePath, 'utf8'));
    }

    // Save the new token in the tokens object
    tokens[userId] = accessToken;

    // Write the updated tokens object back to the file
    fs.writeFileSync(tokensFilePath, JSON.stringify(tokens, null, 2));
}

app.listen(5000, () => {
    console.log('Server started on port 5000')
})