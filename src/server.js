/* eslint-disable no-unused-vars */
const dotenv = require('dotenv');
const morgan = require('morgan');

const app = require('./app');

// Load the environment variables
dotenv.config({ path: 'src/config/.env' });

const connectDb = require('./config/db');
const logger = require('./logger/logger');
// Connect Db
connectDb();

// Winston logger
const morganFormat =
  process.env.NODE_ENV !== 'PRODUCTION' ? 'DEVELOPMENT' : 'combined';

app.use(
  morgan(morganFormat, {
    skip(req, res) {
      return res.statusCode < 400;
    },
    stream: process.stderr,
  })
);

app.use(
  morgan(morganFormat, {
    skip(req, res) {
      return res.statusCode >= 400;
    },
    stream: process.stdout,
  })
);

app.get('/', (req, res) => {
  logger.debug('Debug statement');
  logger.info('Info statement');
  res.send(`${req.method} ${req.originalURL}`);
});

app.get('/error', (req, res) => {
  throw new Error('Problem Here!');
});

// All errors are sent back as JSON
app.use((err, req, res, next) => {
  // Fallback to default node handler
  if (res.headersSent) {
    next(err);
    return;
  }

  logger.error(err.message, { url: req.originalUrl });

  res.status(500);
  res.json({ error: err.message });
});

// Handle uncaught exceptions error
process.on('uncaughtException', err => {
  logger.error(`ERROR: ${err.stack}`);
  logger.warn('Shutting down the server due to uncaughtException');
  process.exit(1);
});

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  logger.info(
    `Server is running on port ${port} in ${process.env.NODE_ENV} mode.`
  );
  logger.info(`Social app listening on port ${port}`);
  logger.debug(`More detailed log, ${port}`);
});

// Handle UnhandledPromiseRejection error
process.on('unhandledRejection', err => {
  logger.error(`ERROR: ${err.message}`);
  logger.warn('Shutting down the server due to UnhandledPromiseRejection');
  server.close(() => {
    process.exit(1);
  });
});
