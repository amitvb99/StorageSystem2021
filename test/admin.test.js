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

describe('Admin Tests', function() {

    after(function(done) {
        User.collection.drop();
        done();
    });

    it('Should promote a user to admin, and then demote it back to regular user', function(done) {
        chai.request(server)
        .post('/api/user/register')
        .send({
            "name": "amit",
            "username": "amitvig",
            "passowrd": "123444"
        })
        .end(function(res, err) {
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.have.property('message').eql("success");
            var id = res.body.data;

            chai.request(server)
            .post('/api/user/login')
            .send({
                "username": "admin",
                "password": "admin"
            });
            chai.request(server)
            .post('/api/user/manage/promoteUser' + id)
            .send({
                "id": id
            })
            .end(function(res, err) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.have.property("message").eql("success");

                chai.request(server)
                .post('/api/user/manage/demoteAdmin' + id)
                .send({
                    "id": id
                })
                .end(function(res, err) {
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.have.property("message").eql("success");
                    console.log("asddddddddddddddddddddddddddddddddddddd");
                });
            });
            done();
        });
    });
});
