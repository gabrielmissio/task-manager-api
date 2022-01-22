const express = require('express');

const app = express();
const setupApp = require('./setup');
const appRoutes = require('./routes');

setupApp(app);
appRoutes(app);

module.exports = app;
