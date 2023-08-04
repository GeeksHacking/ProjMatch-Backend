// Gets Access Token and passes it to all Test Suites
const axios = require("axios")
const fs = require('fs');
require("dotenv").config({ path: "./__tests__/.env.test" })

let token;

const getAccessToken = async () => {
    // var apiOptions = {
    //     method: 'POST',
    //     url: 'https://projmatch.us.auth0.com/oauth/token',
    //     headers: {
    //         'content-type': 'application/x-www-form-urlencoded',
    //     },
    //     data: new URLSearchParams({
    //         grant_type: 'client_credentials',
    //         client_id: process.env.AUTH0_CLIENT_ID,
    //         client_secret: process.env.AUTH0_CLIENT_SECRET,
    //         audience: process.env.AUTH0_AUDIENCE,
    //     })
    // };
    
    // await axios.request(apiOptions).then(function (res) {
    //     global.accessToken = res.data["access_token"]
    // }).catch(function (err) {
    //     console.error("Failed to get API Authentication Token with: ", err)
    // })

    global.accessToken = process.env.M2M_TOKEN // Use M2M token from .env file
}

module.exports = async () => {
    if (!global.accessToken) {
        await getAccessToken()
    }
}