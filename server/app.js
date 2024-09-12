const express = require('express')
const drawingRouter = require('./routers/drawingRouter')
const bodyParser = require("body-parser");
const dotenv = require('dotenv')
const path = require("path");

dotenv.config()

const app = express()

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE, delete');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization,Accept,filename');

    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// Serve static files from the React app build folder
app.use(express.static(path.join(__dirname, "../client/dist")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/drawing', drawingRouter)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});


module.exports = app