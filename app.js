'use strict';

const express        = require('express');
const app = express();
require('dotenv').config();
const config         = require('./config');
const http          = require('http');
const mongoose       = require('mongoose');
const bodyParser     = require('body-parser');

// Seting up Mongoose default Promise to bluebird
mongoose.Promise = require('bluebird');

// Build the connection string
 const env  = process.env.NODE_ENV;

let dbURI;
if (env) {
  dbURI = config.dbUrl[env];
} else {
  dbURI = config.dbUrl.production;
}
// const dbURI = 'mongodb://127.0.0.1:27017/testdb';
// Create the database connection
mongoose.connect(dbURI);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
  console.log(`Mongoose default connection open to ${dbURI}`);
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  console.log(`Mongoose default connection error: ${err}`);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () =>  {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  // something went unhandled.
  // Do any cleanup and exit anyway!

  console.error(err); // don't do just that.

  // FORCE exit the process too.
  process.exit(1);
});



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const route          = require('./server/routes/index.route');
app.use(route);

app.use((err, req, res, next) => {
  if (err) {
    if (err.isBoom) {
      res.status(err.output.statusCode).send(err.output.payload);
    } else if (err.status == null) {
      console.error('Internal unexpected error from:', err.stack);
      res.status(500);
      res.json(err);
    } else {
      res.status(err.status);
      res.json(err);
    }
  } else {
    next();
  }
});


http.createServer(app).listen(7007);
console.log('Society Server started on port 7007');



