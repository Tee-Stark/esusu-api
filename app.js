require('dotenv').config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const userRoutes = require('./routes/UserRoutes');
const groupRoutes = require('./routes/GroupRoutes');
// const API_PREFIX = '/api/v1';
const ErrorHandler = require("./utils/errorHandler");

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(ErrorHandler)
// app.use('/', (req, res) => {
//     res.send('Welcome to the API');
// })

app.use("api/v1/", (req, res) => {
    res.send("Welcome to T-STARK\'s Esusu platform💰💰💰💰") 
})
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/group", groupRoutes)

module.exports = app;