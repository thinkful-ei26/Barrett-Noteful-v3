'use strict';
const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

// find/search
// mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
//   .then(() => {
//     const searchTerm = 'lady gaga';
//     let filter = {};

//     if (searchTerm) {
//       filter.title = { $regex: searchTerm, $options: 'i' };
//     }

//     return Note.find(filter).sort({ updatedAt: 'desc' });
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect()
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });


// find by id
// mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
//   .then(() => {
//     const id = '5bfdafc08e868c5c117f83ca';
//     return Note.findById(id);
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

// create a note
// mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
//   .then(() => {
//     const newNote = {
//       title: 'test create',
//       content: 'woo I created a note!'
//     };
//     return Note.create(newNote)
//       .then(results => {
//         console.log(results);
//       })
//       .then(() => {
//         return mongoose.disconnect();
//       })
//       .catch(err => {
//         console.error(`ERROR: ${err.message}`);
//         console.error(err);
//       });
//   });

// update note by id
// mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
//   .then(() => {
//     const id = '5bfdafc08e868c5c117f83ca';
//     return Note.findByIdAndUpdate(id, {
//       title: 'test update',
//       content: 'this note got updated fool.'
//     })
//       .then(results => {
//         console.log(results);
//       })
//       .then(() => {
//         return mongoose.disconnect();
//       })
//       .catch(err => {
//         console.error(`ERROR: ${err.message}`);
//         console.error(err);
//       });
//   });

// delete note by id
// mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
//   .then(() => {
//     const id = '5bfdafc08e868c5c117f83ca';
//     return Note.findByIdAndRemove(id);
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });