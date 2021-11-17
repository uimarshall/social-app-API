const express = require('express');
const errorMiddleware = require('./api/middlewares/errors');

const userAuthRoute = require('./api/routes/users');

// TODO: Add swagger documentation

// Initialize app
const app = express();

// Middleware
app.use(express.json());

// Routes Middleware

app.use('/api/v1/users', userAuthRoute);

// Custom Error Middleware to handle error
app.use(errorMiddleware);

module.exports = app;
