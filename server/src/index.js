const express = require("express");

// Root Express App
const app = express();

// General Settings
app.disable('etag');

// Sub-Apps
const api = require("./app");
const probot = require('./probot');
// var errors = require("../errors/app");

/**
 *  GET /
 *  Health Check
 */
app.get('/', (_req, res) => res.status(200).send('ok'));

app.use("/api", api);
app.use("/hooks/github", probot);
// app.use(errors);

module.exports = app;