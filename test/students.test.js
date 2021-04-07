process.env.NODE_ENV = 'test';
var server = require('../server/app');

var chai = require('chai');

var Student = require('../server/models/student.model');
var chaiHttp = require('chai-http');
var jwt = require('jsonwebtoken');
const { request } = require('../server/app');

var should = chai.should();

var token = '';
var message = undefined;

chai.use(chaiHttp);


describe('Student Tests', function() {

    after(function (done) {
        Student.collection.drop();
        done();
    });

    it('Sould create a new student in /api/user/students/create/ POST', function(done) {
        chai.request(server)
        .post('/api/user/students/create')
        .send({
            'fName': 'Amit',
            'lName': 'Vigdor Bart',
            'school': 'BGU',
            'level': '7th',
            'class': '2',
            'parent1Name': 'parent1',
            'parent2Name': 'parent2',
            'parent1PhoneNumber': '0234768712',
            'parent2PhoneNumber': '1230917983',
            'parent1Email': 'parent1@ninini.com',
            'parent2Email': 'parent2@ninini.com',
        })
        .end(function(err,res){
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.have.property('message').eql("success");
            var id = res.body.data;
            chai.request(server)
            .put('/api/user/students/' + id)
            .send({
                'school': 'Tel Aviv University'
            })
            .end(function(err, res){
                res.should.have.status(200);
                chai.request(server)
                .get('/api/user/students/' + id)
                .send({})
                .end(function(err, res){
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.have.property('message').eql("success");
                    res.body.data.should.have.property('school').eql("Tel Aviv University");
                });
            });
            done();
        });
    });

    it('Should retrieve all students in /api/students/ POST', function(done) {
        chai.request(server)
        .get('/api/user/students')
        .send({})
        .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('message').eql('success');
            // done();
        });
    });

    it('should filter students only in 7th level', function(done) {
        chai.request(server)
        .post('/api/user/students/create')
        .send({
            'fName': 'Lionel',
            'lName': 'Messi',
            'school': 'FC Barcelona',
            'level': '7th',
            'class': '5',
            'parent1Name': 'parent1',
            'parent2Name': 'parent2',
            'parent1PhoneNumber': '0234768712',
            'parent2PhoneNumber': '1230917983',
            'parent1Email': 'parent1@ninini.com',
            'parent2Email': 'parent2@ninini.com',
        });
        chai.request(server)
        .post('/api/user/students/create')
        .send({
            'fName': 'Cristiano',
            'lName': 'Ronaldo',
            'school': 'Juventus',
            'level': '9th',
            'class': '2',
            'parent1Name': 'parent1',
            'parent2Name': 'parent2',
            'parent1PhoneNumber': '0234768712',
            'parent2PhoneNumber': '1230917983',
            'parent1Email': 'parent1@ninini.com',
            'parent2Email': 'parent2@ninini.com',
        });
        chai.request(server)
        .get('/api/user/students/filter/class_7th')
        .send({})
        .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.data.every(function(element, index) {
                element.should.have.property('level').eql('7th');
            });
            done();
        });
    });

    it('should filter students only in class 2', function(done) {
        chai.request(server)
        .get('/api/user/students/filter/2_level')
        .send({})
        .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.data.every(function(element, index) {
                element.should.have.property('class').eql('2');
            });
            done();
        });
    });

    it('should filter students only in class 2 and 7th level', function(done) {
        chai.request(server)
        .get('/api/user/students/filter/2_7th')
        .send({})
        .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.data.every(function(element, index) {
                element.should.have.property('level').eql('7th');
                element.should.have.property('class').eql('2');
            });
            done()
        });
    });
});

