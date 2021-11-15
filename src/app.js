const express = require('express');

const userAuthRoute = require('./api/routes/users');
// TODO: Add swagger documentation

// Initialize app
const app = express();

// Middleware
app.use(express.json());

// Routes Middleware

app.use('/api/v1/users', userAuthRoute);
module.exports = app;
