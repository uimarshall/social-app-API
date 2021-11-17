const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const errorMiddleware = require('./api/middlewares/errors');

const userAuthRoute = require('./api/routes/users');

// TODO: Add swagger documentation

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors()); // to handle request coming frm diff origins e.g.client will make req frm port 3000

// Routes Middleware

app.use('/api/v1/users', userAuthRoute);

// Custom Error Middleware to handle error
app.use(errorMiddleware);

module.exports = app;
