var express = require('express');
var app = express();
const electionJSON = require('../build/contracts/Election.json')
const truffleContract = require('truffle-contract');

require("dotenv").config();

app.use(express.static("./"));

app.get('/', (req,res) => {
    res.send('index.html');
})

app.get('/electionJSON', (req,res) => {
    res.send(electionJSON);
})

app.get('/truffleContract', (req,res) => {
    res.send(truffleContract);
})

app.listen(process.env.PORT || 3000, () => {
    console.log('Server started at 3000');
})