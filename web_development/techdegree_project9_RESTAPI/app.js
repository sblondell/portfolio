// load modules
const express = require('express');
const routes = require('./routes/routes.js');
const morgan = require('morgan');
const mongoose = require('mongoose');
const jsonParser = require('body-parser');
const cors = require('cors');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// enable CORS
app.use(cors());

// Initiate the json body parser
 app.use(jsonParser());

// Connect mongoose to the mongo database
var db = mongoose.connection;
mongoose.connect("mongodb://localhost:27017/fsjstd-restapi", { useNewUrlParser: true });

db.on("error", err => {
    console.log("Error connecting to mongoDB: " + err);
});
db.once("open", () => {
    console.log("MongoDB connection successful.");
});

// TODO setup your api routes here
app.use('/api', routes);

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
