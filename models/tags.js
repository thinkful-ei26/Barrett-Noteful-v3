'use strict';
const mongoose = require('mongoose');

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
module.exports = { Tag };
