const express = require("express")
const app = express();
const port = 3000

// twitterの設定
const Twitter = require('twitter');
require("dotenv").config();
const twitter = new Twitter({
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_SECRET_KEY,
    access_token_key: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

// routes
app.get("/", function(req, res, next) {
    res.send("server is up")
});

app.get("/twieets", function(req, res, next) {

    const userData = req.query["name"]
    const params = { screen_name: userData, count: 200, trim_user: true, exclude_replies: true, include_rts: false };

    twitter.get('statuses/user_timeline', params, function(error, result, response) {
        if (error) {
            res.send(error)
        } else {
            const filterResult = result.filter(
                twieetData => !twieetData.entities.urls.length && !twieetData.entities.media
            )
            const processedResult = filterResult.map(data => data.text)

            res.send(processedResult);
        }
    });
})

app.listen(port, function() {
    console.log('Listening on port ' + port)
});