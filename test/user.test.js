process.env.NODE_ENV = 'test';
var server = require('../server/app');

var chai = require('chai');

var User = require('../server/models/user.model');
var chaiHttp = require('chai-http');
var jwt = require('jsonwebtoken');

var should = chai.should();

var token = '';
var message = undefined;

chai.use(chaiHttp);


describe('User Authintication', function() {
  // User.collection.drop();
  // afterEach(function (done) {
  //   User.collection.drop();
  //   done();
  // });


  describe('register', function(){



    it('Should register a new user in /api/user/register/ POST',function (done){
      chai.request(server)
      .post('/api/user/register')
      .send({
        "name": "mahmoud",
        "username": "salehma",
        "password": "123"
      })
      .end(function(err,res){
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.have.property('message').eql("User Created!");
        done();
      });
    });

  });

  describe('register error', function(){
    it('Should register a new user in /api/user/register/ POST',function (done){
      chai.request(server)
      .post('/api/user/register')
      .send({
        "name": "mahmoud",
        "username": "salehma",
        "password": "123"
      })
      .end(function(err,res){
        res.should.have.status(500);
      });
    });
  });
});

