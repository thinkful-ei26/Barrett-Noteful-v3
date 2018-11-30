'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const { noteSchema } = require('../models/note');
const { Folder } = require('../models/folder');

// GET/READ all folders
router.get('/', (req, res, next) => {
  Folder.find()
    .sort('name')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

// GET/READ folder by ID
router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Folder.findById(id)
    .then(result => {
      if (result) {
        res.status(200).json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

// POST/CREATE Folder
router.post('/', (req, res, next) => {
  const { name } = req.body;
  console.log({name});
  const newFolder = { name };

  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  Folder.create(newFolder)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The folder name already exists');
        err.status = 400;
      }
      next(err);
    });
});

// PUT/UPDATE folder
router.put('/:id', (req, res, next) => {
  const {id} = req.params;
  const {name} = req.body;

  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Folder.findByIdAndUpdate(id, {name})
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The folder name already exists');
        err.status = 400;
      }
      next(err);
    });
});

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  noteSchema.pre('findByIdAndRemove', function(next) {
    this.remove(noteSchema.folderId);
    next();
  });

  Folder.findByIdAndRemove(id)
    .then(result => {
      if (result) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    }); 
});

module.exports = router;