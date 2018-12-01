'use strict';
const mongoose = require('mongoose');

const {Note} = require('./note');

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

folderSchema.pre('findOneAndRemove', function(next) {

  // Note.find({folderId: this.getQuery()._id })
  return Note.updateMany(
    { folderId: this.getQuery()._id },
    { $unset: { folderId: '' } }
  )
    .then(() => {
      next();
    });
  
  // console.log(this._conditions._id);
  // console.log(this.getQuery()._id);
  
});

const Folder = mongoose.model('Folder', folderSchema);
module.exports = { Folder };