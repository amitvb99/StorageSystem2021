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
  after(function (done) {
    User.collection.drop();
    done();
  });

    it('Should register a new user in /api/user/register/ POST',function (done){
      chai.request(server)
      .post('/api/user/register')
      .send({
        "name": "mahmoud",
        "user": "salehma1",
        "pass": "123444"
      })
      .end(function(err,res){
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.have.property('message').eql("success");
        done();
      });
    });

    it('Should register a new user in /api/user/register/ POST',function (done){
      chai.request(server)
      .post('/api/user/register')
      .send({
        "name": "baraa",
        "user": "baraana",
        "pass": "123"
      })
      .end(function(err,res){
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.have.property('message').eql("success");
        done();
      });
    });


    it('Should not register a new user in /api/user/register/ POST',function (done){
      chai.request(server)
      .post('/api/user/register')
      .send({
        "name": "mahmoud",
        "username": "salehma",
        "password": "123"
      })
      .end(function(err,res){
        res.should.have.status(500);
        done();
      });
    });

    it('Should login a user in /api/user/login/ POST',function (done){
      chai.request(server)
      .post('/api/user/login')
      .send({
        "username": "salehma1",
        "password": "123444"
      })
      .end(function(err,res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('message').eql("success");
        done();
      });
    });


    it('Should get all the users in /api/user/users GET',function (done){
      chai.request(server)
      .get('/api/user/users')
      .send({})
      .end(function(err,res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('message').eql("success");
        res.body.data[0].should.have.property('name');
        res.body.data[0].name.should.equal('mahmoud');
        res.body.data[0].should.have.property('username');
        res.body.data[0].username.should.equal('salehma1');
        res.body.data[0].should.have.property('password');
        res.body.data[0].password.should.equal('123444');
        res.body.data[1].should.have.property('name');
        res.body.data[1].name.should.equal('baraa');
        res.body.data[1].should.have.property('username');
        res.body.data[1].username.should.equal('baraana');
        res.body.data[1].should.have.property('password');
        res.body.data[1].password.should.equal('123');
        done();
      });
    });

    it('Should not login a user in /api/user/login/ POST',function (done){
      chai.request(server)
      .post('/api/user/login')
      .send({
        "username": "salehma1",
        "password": "1234445"
      })
      .end(function(err,res){
        res.should.have.status(401);
        res.should.be.json;
        res.body.should.have.property('message').eql("failed");
        done();
      });
    });

    it('Should not login a user in /api/user/login/ POST',function (done){
      chai.request(server)
      .post('/api/user/login')
      .send({
        "username": "saleh1",
        "password": "1234445"
      })
      .end(function(err,res){
        res.should.have.status(401);
        res.should.be.json;
        res.body.should.have.property('message').eql("failed");
        done();
      });
    });
});

