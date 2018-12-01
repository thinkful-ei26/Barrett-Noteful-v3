'use strict';
// ---re-seed db--- node utils/seed-database.js
const mongoose = require('mongoose');

const { MONGODB_URI } = require('../config');
const {Note} = require('../models/note');
const {Folder} = require('../models/folder');
const {Tag} = require('../models/tags');

const { notes, folders, tags } = require('../db/seed/data');


mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => {
    return Promise.all([
      Note.insertMany(notes),
      Folder.insertMany(folders),
      Folder.createIndexes(),
      Tag.insertMany(tags),
      Tag.createIndexes()
    ]);
  })
  .then(results => {
    console.info(`Inserted ${results.length} Notes`);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(err);
  });