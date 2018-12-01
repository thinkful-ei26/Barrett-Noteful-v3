'use strict';
// MIDDLEWARE PATTERN

// Libraies
const express = require('express'); // middleware
const morgan = require('morgan'); // logger
const mongoose = require('mongoose');

const { PORT, MONGODB_URI } = require('./config');  // config

// Router strategies
const notesRouter = require('./routes/notes');
const foldersRouter = require('./routes/folders');
const tagsRouter = require('./routes/tags');



// Create an Express application
const app = express();

// Log all requests. Skip logging during tests
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common', {
  skip: () => process.env.NODE_ENV === 'test'
}));

// Create a static webserver. Serve static web files from public folder
app.use(express.static('public'));

// Authentication here?

// Parse request body Optimization
app.use(express.json()); // what's this really doing?

// Mount routers
app.use('/api/notes', notesRouter);
app.use('/api/folders', foldersRouter);
app.use('/api/tags', tagsRouter);

// Custom 404 Not Found route handler for routes that are not found
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Custom Error Handler for all return next(err)
app.use((err, req, res, next) => {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});    

// Only when server starts up
if (require.main === module) {
  // Connect to DB and Listen for incoming connections
  mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error('\n === Did you remember to start `mongod`? === \n');
      console.error(err);
    });

  // Listen for incoming connections
  if (process.env.NODE_ENV !== 'test') { // environment variable
    app.listen(PORT, function () {
      console.info(`Server listening on ${this.address().port}`);
    }).on('error', err => {
      console.error(err);
    });
  }
}


module.exports = app; // Export for testing