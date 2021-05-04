var express = require('express');
var app = express();

//JSON file for deployed contract and network information
const electionJSON = require('../build/contracts/Election.json')

require("dotenv").config();

app.use(express.static("./"));

app.get('/', (req,res) => {
    res.send('index.html');
});

app.get('/electionJSON', (req,res) => {
    res.send(electionJSON);
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server started at 3000');
});