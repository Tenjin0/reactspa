process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var User = require('../models/user');
var Note = require('../models/note');
var initDBTest = require('../config/initDBTest');
const jwt = require('jsonwebtoken');
const config = require('../config/index.json');

var should = chai.should();

chai.use(require('chai-string'));
// var supertest  = require("supertest");
// var server = supertest.agent("http://localhost:3000");
chai.use(chaiHttp);

var assert = chai.assert;

describe('Users', function() {
    var users;

    before(function(done) {
        User.collection.drop();
        Note.collection.drop();
        // initDBTest(User, Note, function(err, initUsers){
            // users = initUsers;
            done();
        // });
    });

    beforeEach(function(done) {
        initDBTest(User,Note,  function(err, initUsers){
            users = initUsers;
            done();
        });
    });

    afterEach(function(done) {
        User.collection.drop();
        Note.collection.drop();
        done();
    });

    it('should send token to register POST', function(done) {
        chai.request(server)
        .post('/auth/register')
        .send({
            "email": "patricepetit+a@gmail.com",
            "username": "tenji",
            "password": "test",
            "confirmPassword": "test",
            "firstname": "Patrice",
            "lastname": "PETIT",
            "role": "Admin"
        })
        .end(function(err, res){
            res.should.have.status(201);
            res.should.be.json;
            // res.body.should.be.a('array');
            done();
        });
    });

    it('should send token to login POST', function(done) {
        chai.request(server)
        .post('/auth/login')
        .send({
            "email": users.Student.user.email,
            "password": "test"
        })
        .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.token.should.startWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
            done();
        });
    });
    
    it('should list all the students GET', function(done) {
        chai.request(server)
        .get('/api/users/students')
        .set({'x-access-token': users.Admin.token})
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.have.property("success");
            res.body.success.should.equal(true);
            res.body.should.have.property("students");
            res.body.students.should.be.a('array');
            res.body.students.length.should.equal(1);
            done();
        });
    });

    it('should get the profile of the user GET', function(done) {
        chai.request(server)
        .get('/api/users/profile')
        .set({'x-access-token': users.Admin.token})
        .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property("success");
            res.body.success.should.equal(true);
            res.body.should.have.property("profile");
            res.body.profile._id.should.equal( users.Admin.user._id.toString());
            // res.body.should.be.a('array');
            done();
        });
    });

    it('should edit the profile of the user PUT', function(done) {
        var firstname = "Andre";
        chai.request(server)
        .put('/api/users/profile')
        .set({'x-access-token': users.Admin.token})
        .send({ firstname})
        .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property("success");
            res.body.success.should.equal(true);
            res.body.should.have.property("profile");
            res.body.profile._id.toString().should.equal( users.Admin.user._id.toString());
            res.body.profile.firstname.should.equal(firstname);
            done();
        });
    });

    it('should get the student define by the id GET', function(done) {
        chai.request(server)
        .get('/api/users/students/' + users.Student.user._id)
        .set({'x-access-token': users.Admin.token})
        .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property("success");
            res.body.success.should.equal(true);
            res.body.should.have.property("student");
            res.body.student._id.should.equal(users.Student.user._id.toString());
            done();
        });
    });

    it('should modify the user define by the id PUT', function(done) {
        var firstname = "Edouard";
        chai.request(server)
        .put('/api/users/' + users.Student.user._id)
        .set({'x-access-token': users.Admin.token})
        .send({firstname})
        .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property("success");
            res.body.success.should.equal(true);
            res.body.should.have.property("user");
            res.body.user._id.should.equal(users.Student.user._id.toString());
            res.body.user.firstname.should.equal(firstname);
            done();
        });
    });

    it('should get the notes of the owner  GET', function(done) {
        chai.request(server)
        .get('/api/users/profile/notes')
        .set({'x-access-token': users.Student.token})
        .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property("success");
            res.body.success.should.equal(true);
            res.body.should.have.property("notes");
            res.body.notes.should.be.a('array');
            res.body.notes[0].grade.should.be.equal(19);
            res.body.notes[0].subject.should.be.equal("Math");
            done();
        });
    });

    it('should NOT get the note of the student GET', function(done) {
        chai.request(server)
        .get('/api/users/student/' + users.Student._id + '/notes')
        .set({'x-access-token': users.Student.token})
        .end(function(err, res){
            res.should.have.status(401);
            res.should.be.json;
            res.body.should.have.property("success");
            res.body.success.should.equal(false);
            res.body.should.have.property("message");
            res.body.message.should.equal("Do not have access to notes list");
            done();
        });
    });

    it('should get the note of the student GET', function(done) {
        chai.request(server)
        .get('/api/users/student/' + users.Student.user._id + '/notes')
        .set({'x-access-token': users.Admin.token})
        .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property("success");
            res.body.success.should.equal(true);
            res.body.should.have.property("notes");
            res.body.notes[0]._id.should.equal(users.Student.note._id.toString());
            done();
        });
    });



    it('should not add note for the student POST', function(done) {
        chai.request(server)
        .post('/api/users/student/' +  users.Student.user._id + '/notes')
        .set({'x-access-token':  users.Trainer.token})
        .send({grade: 19, subject: "History", comment:"very good"})
        .end(function(err, res){
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.have.property("success");
            res.body.success.should.equal(true);
            res.body.should.have.property("notes");
            res.body.notes.grade.should.equal(19);
            res.body.notes.subject.should.equal("History");
            done();
        });
    });

    it('should modify notes of the student PUT', function(done) {
        chai.request(server)
        .put('/api/users/student/' + users.Student.user._id + '/notes/' + users.Student.note._id)
        .set({'x-access-token':  users.Trainer.token})
        .send({grade: 18})
        .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property("success");
            res.body.success.should.equal(true);
            res.body.should.have.property("note");
            res.body.note.grade.should.equal(18);
            res.body.note.subject.should.equal("Math");
            done();
        });
    });

    it('should delete note of the student DELETE', function(done) {
        chai.request(server)
        .delete('/api/users/student/' + users.Student.user._id.toString() + '/notes/' + users.Student.note._id)
        .set({'x-access-token':  users.Admin.token})
        .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property("success");
            res.body.success.should.equal(true);
            res.body.should.have.property("note");
            res.body.note._id.should.equal(users.Student.note._id.toString());
            res.body.note.id_user.should.equal(users.Student.user._id.toString());
            done();
        });
    });

    it('should get the average scor  of the student GET', function(done) {
        chai.request(server)
        .get('/api/users/student/' + users.Student.user._id + '/notes/average')
        .set({'x-access-token':  users.Admin.token})
        .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property("success");
            res.body.success.should.equal(true);
            res.body.should.have.property("averageNote");
            res.body.averageNote.should.equal(19);
            done();
        });
    });

});