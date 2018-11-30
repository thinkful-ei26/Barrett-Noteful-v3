'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');

const { Note } = require('../models/note');
const { Folder } = require('../models/folder');

const { notes, folders } = require('../db/seed/data');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Noteful API resource', function() {
  before(function () {
    return mongoose.connect(TEST_MONGODB_URI)
      .then(() => mongoose.connection.db.dropDatabase());
  });
    
  beforeEach(function () {
    return Promise.all([
      Note.insertMany(notes),
      Folder.insertMany(folders)
    ])
      .then(() => {
        return Note.createIndexes();
      });
  });
    
  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });
    
  after(function () {
    return mongoose.disconnect();
  });

  describe('GET /api/notes', function() {
    it('should return all notes', function() {
      let res;
      return chai.request(app)
        .get('/api/notes')
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.lengthOf.at.least(1);
          return Note.count();
        })
        .then(function(count) {
          expect(res.body).to.have.lengthOf(count);
        });
    });
		
    it('should return an array of objects with the id, title and content', function() {
      let resNote;
      const expectedKeys = ['id', 'title', 'content', 'createdAt', 'updatedAt'];
      return chai.request(app)
        .get('/api/notes')
        .then(function(res) {
          res.body.forEach(function(note) {
            expect(note).to.be.a('object');
            expect(note).to.include.keys(expectedKeys);
          });
          resNote = res.body[0];
          return Note.findById(resNote.id)
            .then(function(note) {
              expect(resNote.id).to.equal(note.id);
              expect(resNote.title).to.equal(note.title);
              expect(resNote.content).to.equal(note.content);
            });
        });
    });
		
    it('should return correct search results for a valid query', function() {
      const search = 'lady';
      let searchNote;
      return chai
        .request(app)
        .get(`/api/notes/?searchTerm=${search}`)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.be.an('object');
          searchNote = res.body[0];
          return Note.findById(searchNote.id)
            .then(function(note) {
              expect(searchNote.id).to.equal(note.id);
              expect(searchNote.title).to.equal(note.title);
              expect(searchNote.content).to.equal(note.content);
            });
        });
    });

    it('should return correct search results for a folderId query', function () {
      const folderSearchId = '111111111111111111111100';
      let res;
      return chai
        .request(app)
        .get(`/api/notes/?folderId=${folderSearchId}`)
        .then(function(_res) {
          res = _res;
          console.log(res.body);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          return Folder.findById(folderSearchId)
            .then(function(folder) {
              //forEach to loop through res.body array 
              expect(res.body[0].folderId).to.equal(folder.id);
            });
        });
    });

    it('should return correct search results for a tagId query', function () {
      
    });
		
    it('should return an empty array for an incorrect query', function(){
      return chai.request(app)
        .get('/api/notes?searchTerm=Does%20Not%20exist')
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(0);
        });
    });
  });
	
//   describe('GET /api/notes/:id', function() {
	
//     it('should return correct note object with id, title and content for a given id', function() {
//       const searchId = '000000000000000000000000';
//       let resNote;
  
//       return chai
//         .request(app)
//         .get(`/api/notes/${searchId}`)
//         .then(function (res) {
//           expect(res.body).to.be.a('object');
//           expect(res.body).to.include.keys('id', 'title', 'content');
//           expect(res.body.id).to.equal(searchId);
//           resNote = res.body;
//           return Note.findById(resNote.id)
//             .then(function(note) {
//               expect(resNote.id).to.equal(note.id);
//       		  });
//       	});
//     });
		
//     it('should respond with a 404 for an invalid id', function() {
//       return chai
//         .request(app)
//         .get('/api/notes/DOESNOTEXIST')
//         .then(function(res) {
//           expect(res).to.have.status(404);
//         });
//     });
//   });
	
//   describe('POST /api/notes', function() {

//     it('should create and return a new item with location header when provided valid data', function() {
//       const newItem = {
//         title: 'foo', content:'bar'
//       };
//       let resNote;
//       return chai
//         .request(app)
//         .post('/api/notes')
//         .send(newItem)
//         .then(function(res) {
//           resNote = res;
//           expect(res).to.have.status(201);
//           expect(res).to.have.header('location');
//           expect(res).to.be.json;
//           expect(res.body).to.be.a('object');
//           expect(res.body).to.have.all.keys('id', 'title', 'content', 'createdAt', 'updatedAt');
//           return Note.findById(resNote.body.id)
//             .then(function(note) {
//               expect(resNote.body.id).to.equal(note.id);
//               expect(resNote.title).to.equal(note.title);
//               expect(resNote.content).to.equal(note.content);
//               expect(new Date(resNote.body.createdAt)).to.deep.equal(note.createdAt);
//               expect(new Date(resNote.body.updatedAt)).to.deep.equal(note.updatedAt);
//             });
//         });
//     });
		
//     it('should return error "Missing title in request body" when missing "title" field', function() {
//       const newItem = {	content:'bar'};
//       return chai
//         .request(app)
//         .post('/api/notes')
//         .send(newItem)
//         .then(function(res) {
//           expect(res).to.have.status(400);
//           expect(res).to.be.json;
//           expect(res.body).to.be.a('object');
//           expect(res.body.message).to.equal('Missing `title` in request body');
//         });
//     });
//   });

//   describe('PUT /api/notes/:id', function () {

//     it('should update the note when provided valid data', function () {
//       const updateItem = {
//         title: 'foo', content:'bar'
//       };
//       let resNote;
//       return chai
//         .request(app)
//         .put('/api/notes/000000000000000000000000')
//         .send(updateItem)
//         .then(function(res) {
//           resNote = res;
//           expect(res).to.have.status(200);
//           expect(res).to.be.json;
//           expect(res.body).to.be.a('object');
//           expect(res.body).to.include.keys('id', 'title', 'content', 'createdAt', 'updatedAt');
//           return Note.findById(res.body.id);
//         })
//         .then(function(note) {
//           expect(resNote.body.title).to.equal(note.title);
//           expect(resNote.body.content).to.equal(note.content);
//           expect(new Date(resNote.body.createdAt)).to.deep.equal(note.createdAt);
//           expect(new Date(resNote.body.updatedAt)).to.deep.equal(note.updatedAt);
//         });
//     });

//     it('should return an object with a message property "Missing title in request body" when missing "title" field', function() {
//       const updateItem = {content: 'bar'};
//       return chai
//         .request(app)
//         .put('/api/notes/000000000000000000000000')
//         .send(updateItem)
//         .then(function(res) {
//           expect(res.body).to.be.a('object');
//           expect(res.body.message).to.equal('Missing `title` in request body');
//         });
//     });

//     it('should respond with a 404 for an invalid id', function() {
//       const updateItem = {title: 'foo', content: 'bar'};
//       return chai
//         .request(app)
//         .put('/api/notes/DOESNOTEXIST')
//         .send(updateItem)
//         .then(function(res) {
//           expect(res).to.have.status(404);
//         });
//     });
//   });

//   describe('DELETE /api/notes/:id', function() {

//     it('should delete an item by id', function() {
      
//       return chai
//         .request(app)
//         .delete('/api/notes/000000000000000000000000')
//         .then(function(res) {
//           expect(res).to.be.status(204);
//         });
//     });
//   });
});