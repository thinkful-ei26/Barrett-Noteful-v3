'use strict';
const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},
     
});

folderSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id; 
    delete ret.__v;
  }
});

folderSchema.set('timestamps', true);

const Folder = mongoose.model('Folder', folderSchema);
module.exports = { Folder };