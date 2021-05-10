process.env.NODE_ENV = 'test';
var server = require('../server/app');

var chai = require('chai');

var Instrument = require('../server/models/instrument.model');
var chaiHttp = require('chai-http');
var jwt = require('jsonwebtoken');

var should = chai.should();

var token = '';
var message = undefined;

chai.use(chaiHttp);

describe('Instrument Tests', function() {

    after(function(done) {
        Instrument.collection.drop();
        done();
    });

    it('Should create a new instrument in /api/user/instrument/create/ POST', function(done) {
        chai.request(server)
        .post('/api/user/instruments/create')
        .send({
            'generalSerialNumber':  '111111',
            'type':  'Saxophone',
            'sub_type': 'Alto',
            'company': 'Selmer',
            'style': 'blabla',
            'imprentedSerialNumber': '222222',
            'ownership': 'Amit',
            'status': 'in storage'
        })
        .end(function(err, res) {
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.have.property('message').eql("success");
            var id = res.body.data;
            chai.request(server)
            .put('/api/user/instruments' + id)
            .send({
                'ownership': 'Not Amit'
            })
            .end(function(err, res) {
                res.should.have.status(201);
                chai.request(server)
                .get('/api/user/instruments' + id)
                .send({})
                .end(function(err, res) {
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.have.property('message').eql('success');
                    res.body.data.should.have.property('ownership').eql("Not Amit");
                });
                done();
            });

        });
    });

    it('Should filter instruments only in type saxophone', function(done) {
        chai.request(server)
        .post('/api/user/instruments/create')
        .send({
            'generalSerialNumber':  '111111',
            'type':  'Saxophone',
            'sub_type': 'Alto',
            'company': 'Selmer',
            'style': 'blabla',
            'imprentedSerialNumber': '222222',
            'ownership': 'Amit',
            'status': 'storage'
        });
        chai.request(server)
        .post('/api/user/instruments/create')
        .send({
            'generalSerialNumber':  '111111',
            'type':  'Saxophone',
            'sub_type': 'Tenor',
            'company': 'Selmer',
            'style': 'blabla',
            'imprentedSerialNumber': '222222',
            'ownership': 'Amit',
            'status': 'storage'
        });
        chai.request(server)
        .post('/api/user/instruments/create')
        .send({
            'generalSerialNumber':  '111111',
            'type':  'Saxophone',
            'sub_type': 'Tenor',
            'company': 'Selmer',
            'style': 'blabla',
            'imprentedSerialNumber': '222222',
            'ownership': 'Amit',
            'status': 'loaned'
        });
        chai.request(server)
        .get('/api/user/instruments/filter/Saxophone_subtype_status')
        .send({})
        .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.data.every(function(element, index) {
                element.should.have.property('type').eql('Saxophone');
            });
            done();
        });
    });

    it('Should filter instruments only in subtype Tenor and type Saxophone', function(done) {
        chai.request(server)
        .get('/api/user/instruments/filter/Saxophone_Tenor_status')
        .send({})
        .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.data.every(function(element, index) {
                element.should.have.property('type').eql('Saxophone');
                element.should.have.property('sub_type').eql('Tenor');
            });
            done();
        });
    });

    it('Should filter instruments only in loaned status', function(done) {
        chai.request(server)
        .get('/api/user/instruments/filter/type_subtype_storage')
        .send({})
        .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.data.every(function(element, index) {
                element.should.have.property('status').eql('storage');
            });
            done();
        });
    });

    // it('Should return the history of an instrument', function(done) {
    //     chai.request(server)
    //     .posst('/api/user/instruments/create')
    //     .send({
    //         'generalSerialNumber':  '111111',
    //         'type':  'Saxophone',
    //         'sub_type': 'Alto',
    //         'company': 'Selmer',
    //         'style': 'blabla',
    //         'imprentedSerialNumber': '222222',
    //         'ownership': 'Amit',
    //         'status': 'storage'
    //     });
    //     chai.request(server)
    //     .post('/api/user/students/create')
    //     .send({
    //         'fName': 'Amit',
    //         'lName': 'Vigdor Bart',
    //         'school': 'BGU',
    //         'level': '7th',
    //         'class': '2',
    //         'parent1Name': 'parent1',
    //         'parent2Name': 'parent2',
    //         'parent1PhoneNumber': '0234768712',
    //         'parent2PhoneNumber': '1230917983',
    //         'parent1Email': 'parent1@ninini.com',
    //         'parent2Email': 'parent2@ninini.com',
    //     });

    // })
});
