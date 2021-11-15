const dotenv = require('dotenv');

const app = require('./app');

// Load the environment variables
dotenv.config({ path: 'src/config/.env' });

const connectDb = require('./config/db');
// Connect Db
connectDb();

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(
    `Server is running on port ${port} in ${process.env.NODE_ENV} mode.`
  );
});

// Handle UnhandledPromiseRejection error
process.on('unhandledRejection', err => {
  console.log(`ERROR: ${err.message}`);
  console.log('Shutting down the server due to UnhandledPromiseRejection');
  server.close(() => {
    process.exit(1);
  });
});
