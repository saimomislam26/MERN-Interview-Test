const express = require('express')
const drawingRouter = require('./routers/drawingRouter')
const bodyParser = require("body-parser");
const dotenv = require('dotenv')

dotenv.config()

const app = express()

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    // console.log(process.env.ORIGIN);
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
    // res.setHeader('Content-Security-Policy', 'script-src http://localhost:3000')
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE, delete');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization,Accept,filename');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api/drawing', drawingRouter)

module.exports = app