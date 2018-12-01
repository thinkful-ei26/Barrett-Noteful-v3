'use strict';
const mongoose = require('mongoose');

const {Note} = require('./note');

const tagSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true
  }
});

tagSchema.set('timestamps', true);

tagSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id; 
    delete ret.__v;
  }
});

const Tag = mongoose.model('Tag', tagSchema);

// tagSchema.pre('findOneAndRemove', function(next) {
//   console.log('tagSchema.pre ran');
// //   Note.updateMany(

// //   );
//   next();
// });

module.exports = { Tag };
